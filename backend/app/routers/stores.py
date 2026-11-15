from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import Optional
from app.database import get_db
from app.models.user import User
from app.schemas.store import NearbyStoresResponse
from app.services.auth_service import get_current_user
from app.services.store_service import get_nearby_stores_for_user

router = APIRouter(prefix="/stores", tags=["Store Discovery"])

@router.get("/nearby", response_model=NearbyStoresResponse)
def find_nearby_stores(
    list_id: Optional[str] = Query(None, description="Optional shopping list ID to match against"),
    lat: Optional[float] = Query(None, description="User latitude"),
    lng: Optional[float] = Query(None, description="User longitude"),
    query: Optional[str] = Query(None, description="Manual location or neighborhood name"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return get_nearby_stores_for_user(
        db=db,
        user_id=current_user.id,
        list_id=list_id,
        lat=lat,
        lng=lng,
        query=query
    )

