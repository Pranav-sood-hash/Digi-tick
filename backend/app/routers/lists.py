from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database import get_db
from app.models.user import User
from app.schemas.shopping_list import (
    ShoppingListCreate,
    ShoppingListUpdate,
    ShoppingListResponse,
    ShoppingListDetailResponse
)
from app.services.auth_service import get_current_user
from app.services.list_service import (
    get_user_lists,
    get_list_by_id,
    create_list,
    update_list,
    delete_list,
    duplicate_list,
    complete_list,
    reuse_list,
    format_list_summary
)

router = APIRouter(prefix="/lists", tags=["Shopping Lists"])

@router.get("", response_model=List[ShoppingListResponse])
def list_shopping_lists(
    status: Optional[str] = Query(None, description="Filter by status: 'active', 'completed'"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return get_user_lists(db, current_user.id, status)

@router.post("", response_model=ShoppingListResponse)
def create_new_list(
    list_in: ShoppingListCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return create_list(db, current_user.id, list_in.title)

@router.get("/{list_id}", response_model=ShoppingListDetailResponse)
def get_single_list(
    list_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    shopping_list = get_list_by_id(db, current_user.id, list_id)
    summary = format_list_summary(shopping_list)
    summary["items"] = shopping_list.items
    return summary

@router.put("/{list_id}", response_model=ShoppingListResponse)
def edit_list(
    list_id: str,
    list_in: ShoppingListUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return update_list(db, current_user.id, list_id, list_in.title, list_in.status)

@router.delete("/{list_id}")
def remove_list(
    list_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return delete_list(db, current_user.id, list_id)

@router.post("/{list_id}/duplicate", response_model=ShoppingListResponse)
def duplicate_existing_list(
    list_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return duplicate_list(db, current_user.id, list_id)

@router.post("/{list_id}/complete", response_model=ShoppingListResponse)
def mark_list_as_completed(
    list_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return complete_list(db, current_user.id, list_id)

@router.post("/{list_id}/reuse", response_model=ShoppingListResponse)
def reuse_completed_list(
    list_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return reuse_list(db, current_user.id, list_id)

