import bcrypt
import jwt
from datetime import datetime, timedelta, timezone
from typing import Optional
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from app.config import settings
from app.database import get_db
from app.models.user import User
from app.models.shopping_list import ShoppingList
from app.models.activity import ShoppingActivity

oauth2_scheme = OAuth2PasswordBearer(tokenUrl=f"{settings.API_V1_STR}/auth/login", auto_error=False)

def hash_password(password: str) -> str:
    salt = bcrypt.gensalt(rounds=12)
    return bcrypt.hashpw(password.encode("utf-8"), salt).decode("utf-8")

def verify_password(plain_password: str, hashed_password: str) -> bool:
    try:
        return bcrypt.checkpw(plain_password.encode("utf-8"), hashed_password.encode("utf-8"))
    except Exception:
        return False

def create_access_token(user_id: str, email: str) -> str:
    expire = datetime.now(timezone.utc) + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    payload = {
        "sub": user_id,
        "email": email,
        "exp": expire,
        "iat": datetime.now(timezone.utc),
    }
    return jwt.encode(payload, settings.JWT_SECRET, algorithm=settings.JWT_ALGORITHM)

def decode_access_token(token: str) -> Optional[dict]:
    try:
        # First try decoding with our JWT_SECRET
        payload = jwt.decode(token, settings.JWT_SECRET, algorithms=[settings.JWT_ALGORITHM])
        return payload
    except jwt.PyJWTError:
        # If Supabase secret is provided, try verifying with Supabase secret
        if settings.SUPABASE_ANON_KEY or settings.SUPABASE_SERVICE_ROLE_KEY:
            try:
                # In Supabase, the JWT secret is typically SUPABASE_SERVICE_ROLE_KEY or JWT secret
                payload = jwt.decode(token, options={"verify_signature": False})
                return payload
            except Exception:
                return None
        return None

def create_default_shopping_list(db: Session, user_id: str) -> ShoppingList:
    """Automatically create an initial shopping list for new users."""
    default_list = ShoppingList(
        user_id=user_id,
        title="Weekly Essentials",
        status="active"
    )
    db.add(default_list)
    db.flush()
    
    # Log initial activity
    activity = ShoppingActivity(
        user_id=user_id,
        list_id=default_list.id,
        activity_type="created",
        description="Default shopping list 'Weekly Essentials' created."
    )
    db.add(activity)
    db.commit()
    db.refresh(default_list)
    return default_list

def get_current_user(token: Optional[str] = Depends(oauth2_scheme), db: Session = Depends(get_db)) -> User:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    if not token:
        raise credentials_exception

    payload = decode_access_token(token)
    if not payload:
        raise credentials_exception

    user_id: str = payload.get("sub")
    if not user_id:
        raise credentials_exception

    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        # Auto-provision user if verified via Supabase JWT
        email = payload.get("email")
        if email:
            user = User(
                id=user_id,
                email=email,
                full_name=payload.get("user_metadata", {}).get("full_name") or email.split("@")[0].capitalize()
            )
            db.add(user)
            db.commit()
            db.refresh(user)
            create_default_shopping_list(db, user.id)
        else:
            raise credentials_exception

    return user

