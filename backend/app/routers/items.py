from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models.user import User
from app.schemas.shopping_item import (
    ShoppingItemCreate,
    ShoppingItemUpdate,
    ShoppingItemResponse,
    BulkItemCommaRequest,
    BulkItemsAddRequest
)
from app.services.auth_service import get_current_user
from app.services.list_service import (
    add_single_item,
    add_comma_separated_items,
    update_item,
    toggle_item,
    delete_item
)

router = APIRouter(prefix="/lists/{list_id}/items", tags=["Shopping Items"])

@router.post("", response_model=ShoppingItemResponse)
def add_item_to_list(
    list_id: str,
    item_in: ShoppingItemCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return add_single_item(db, current_user.id, list_id, item_in)

@router.post("/quick-comma", response_model=List[ShoppingItemResponse])
def add_comma_separated_text(
    list_id: str,
    payload: BulkItemCommaRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return add_comma_separated_items(db, current_user.id, list_id, payload.text)

@router.post("/bulk", response_model=List[ShoppingItemResponse])
def add_multiple_items(
    list_id: str,
    payload: BulkItemsAddRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    results = []
    for item in payload.items:
        created = add_single_item(db, current_user.id, list_id, item)
        results.append(created)
    return results

@router.put("/{item_id}", response_model=ShoppingItemResponse)
def modify_item(
    list_id: str,
    item_id: str,
    item_in: ShoppingItemUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return update_item(db, current_user.id, list_id, item_id, item_in)

@router.patch("/{item_id}/toggle", response_model=ShoppingItemResponse)
def toggle_purchased_status(
    list_id: str,
    item_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return toggle_item(db, current_user.id, list_id, item_id)

@router.delete("/{item_id}")
def remove_item(
    list_id: str,
    item_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return delete_item(db, current_user.id, list_id, item_id)

