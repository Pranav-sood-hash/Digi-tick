import os
import uuid
from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from sqlalchemy.orm import Session
from sqlalchemy import func
from sqlalchemy.exc import IntegrityError
from app.config import settings
from app.database import get_db
from app.models.user import User
from app.schemas.auth import (
    UserRegister,
    UserLogin,
    UserResponse,
    TokenResponse,
    ProfileUpdate,
    GoogleAuthRequest
)
from app.services.auth_service import hash_password, verify_password, create_access_token, get_current_user, create_default_shopping_list

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/register", response_model=TokenResponse)
def register(user_in: UserRegister, db: Session = Depends(get_db)):
    # Check if user exists
    existing = db.query(User).filter(User.email == user_in.email.lower()).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An account with this email already exists"
        )

    # Create user
    new_user = User(
        email=user_in.email.lower(),
        password_hash=hash_password(user_in.password),
        full_name=user_in.full_name or user_in.email.split("@")[0].capitalize()
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    # Automatically create default shopping list
    create_default_shopping_list(db, new_user.id)

    # Generate token
    token = create_access_token(new_user.id, new_user.email)
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": new_user
    }

@router.post("/login", response_model=TokenResponse)
def login(credentials: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == credentials.email.lower()).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No account found. Please create a Digitick account first."
        )

    if not user.password_hash or not verify_password(credentials.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password. Please try again.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    token = create_access_token(user.id, user.email)
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": user
    }

@router.post("/google", response_model=TokenResponse)
def google_auth(payload: GoogleAuthRequest, db: Session = Depends(get_db)):
    verified_email = payload.email.lower()
    full_name = payload.full_name
    avatar_url = payload.avatar_url

    # If an id_token is provided, verify with Google tokeninfo endpoint
    if payload.id_token and payload.id_token.startswith("eyJ"):
        try:
            import urllib.request
            import json
            token_url = f"https://oauth2.googleapis.com/tokeninfo?id_token={payload.id_token}"
            req = urllib.request.Request(token_url)
            with urllib.request.urlopen(req, timeout=5) as resp:
                data = json.loads(resp.read().decode("utf-8"))
                if data.get("email"):
                    verified_email = data["email"].lower()
                    full_name = data.get("name") or full_name
                    avatar_url = data.get("picture") or avatar_url
        except Exception:
            pass

    verified_email = verified_email.strip().lower()
    if not verified_email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="A valid email address is required for Google authentication."
        )

    user = db.query(User).filter(func.lower(User.email) == verified_email).first()

    if user:
        # Existing account: update avatar or name if missing, then log in seamlessly
        updated = False
        if not user.avatar_url and avatar_url:
            user.avatar_url = avatar_url
            updated = True
        if (not user.full_name or user.full_name == user.email.split("@")[0]) and full_name:
            user.full_name = full_name
            updated = True
        if updated:
            db.commit()
            db.refresh(user)

        token = create_access_token(user.id, user.email)
        return {
            "access_token": token,
            "token_type": "bearer",
            "user": user
        }
    else:
        # New account: automatically create Digitick account and log in
        new_user = User(
            email=verified_email,
            password_hash=None,
            full_name=full_name or verified_email.split("@")[0].capitalize(),
            avatar_url=avatar_url,
            auth_provider="google"
        )
        try:
            db.add(new_user)
            db.commit()
            db.refresh(new_user)
            # Automatically initialize default shopping list
            create_default_shopping_list(db, new_user.id)
        except IntegrityError:
            db.rollback()
            new_user = db.query(User).filter(func.lower(User.email) == verified_email).first()
            if not new_user:
                raise HTTPException(
                    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                    detail="Database error during registration"
                )

        token = create_access_token(new_user.id, new_user.email)
        return {
            "access_token": token,
            "token_type": "bearer",
            "user": new_user
        }

@router.get("/me", response_model=UserResponse)
def get_profile(current_user: User = Depends(get_current_user)):
    return current_user

@router.put("/profile", response_model=UserResponse)
def update_profile(
    profile_in: ProfileUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if profile_in.full_name is not None:
        current_user.full_name = profile_in.full_name.strip()
    if profile_in.avatar_url is not None:
        current_user.avatar_url = profile_in.avatar_url.strip()

    db.commit()
    db.refresh(current_user)
    return current_user

@router.post("/profile/avatar", response_model=UserResponse)
def upload_avatar(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Validate image content type
    allowed_types = ["image/jpeg", "image/png", "image/webp", "image/gif"]
    if file.content_type not in allowed_types:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid image format. Allowed formats: JPEG, PNG, WEBP, GIF"
        )

    os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
    ext = os.path.splitext(file.filename or "")[1] or ".jpg"
    filename = f"avatar_{current_user.id}_{uuid.uuid4().hex[:8]}{ext}"
    dest_path = os.path.join(settings.UPLOAD_DIR, filename)

    contents = file.file.read()
    with open(dest_path, "wb") as f:
        f.write(contents)

    current_user.avatar_url = f"/uploads/{filename}"
    db.commit()
    db.refresh(current_user)
    return current_user

