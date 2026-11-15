from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import datetime, timezone
from typing import List, Optional
from fastapi import HTTPException, status

from app.models.shopping_list import ShoppingList
from app.models.shopping_item import ShoppingItem
from app.models.activity import ShoppingActivity
from app.schemas.shopping_item import ShoppingItemCreate, ShoppingItemUpdate
from app.utils.category_matcher import parse_item_text

def format_list_summary(shopping_list: ShoppingList) -> dict:
    total_items = len(shopping_list.items)
    completed_items = sum(1 for item in shopping_list.items if item.is_purchased)
    progress_percent = (completed_items / total_items * 100.0) if total_items > 0 else 0.0

    return {
        "id": shopping_list.id,
        "user_id": shopping_list.user_id,
        "title": shopping_list.title,
        "status": shopping_list.status,
        "completed_at": shopping_list.completed_at,
        "created_at": shopping_list.created_at,
        "updated_at": shopping_list.updated_at,
        "total_items": total_items,
        "completed_items": completed_items,
        "progress_percent": round(progress_percent, 1)
    }

def get_user_lists(db: Session, user_id: str, status_filter: Optional[str] = None) -> List[dict]:
    query = db.query(ShoppingList).filter(ShoppingList.user_id == user_id)
    if status_filter:
        query = query.filter(ShoppingList.status == status_filter)
    query = query.order_by(ShoppingList.updated_at.desc())
    lists = query.all()
    return [format_list_summary(l) for l in lists]

def get_list_by_id(db: Session, user_id: str, list_id: str) -> ShoppingList:
    shopping_list = db.query(ShoppingList).filter(
        ShoppingList.id == list_id,
        ShoppingList.user_id == user_id
    ).first()
    if not shopping_list:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Shopping list not found or unauthorized access"
        )
    return shopping_list

def create_list(db: Session, user_id: str, title: str) -> dict:
    new_list = ShoppingList(
        user_id=user_id,
        title=title.strip(),
        status="active"
    )
    db.add(new_list)
    db.flush()

    activity = ShoppingActivity(
        user_id=user_id,
        list_id=new_list.id,
        activity_type="created",
        description=f"Created shopping list '{new_list.title}'"
    )
    db.add(activity)
    db.commit()
    db.refresh(new_list)
    return format_list_summary(new_list)

def update_list(db: Session, user_id: str, list_id: str, title: Optional[str] = None, new_status: Optional[str] = None) -> dict:
    shopping_list = get_list_by_id(db, user_id, list_id)
    if title is not None:
        shopping_list.title = title.strip()
    if new_status is not None:
        shopping_list.status = new_status
        if new_status == "completed":
            shopping_list.completed_at = datetime.now(timezone.utc)
        elif new_status == "active":
            shopping_list.completed_at = None

    shopping_list.updated_at = datetime.now(timezone.utc)
    db.commit()
    db.refresh(shopping_list)
    return format_list_summary(shopping_list)

def delete_list(db: Session, user_id: str, list_id: str) -> dict:
    shopping_list = get_list_by_id(db, user_id, list_id)
    title = shopping_list.title
    db.delete(shopping_list)
    
    activity = ShoppingActivity(
        user_id=user_id,
        list_id=None,
        activity_type="deleted",
        description=f"Deleted shopping list '{title}'"
    )
    db.add(activity)
    db.commit()
    return {"message": f"Shopping list '{title}' successfully deleted"}

def duplicate_list(db: Session, user_id: str, list_id: str) -> dict:
    original = get_list_by_id(db, user_id, list_id)
    new_title = f"{original.title} (Copy)"
    new_list = ShoppingList(
        user_id=user_id,
        title=new_title,
        status="active"
    )
    db.add(new_list)
    db.flush()

    # Duplicate items
    for item in original.items:
        new_item = ShoppingItem(
            list_id=new_list.id,
            name=item.name,
            quantity=item.quantity,
            unit=item.unit,
            category=item.category,
            notes=item.notes,
            is_purchased=False
        )
        db.add(new_item)

    activity = ShoppingActivity(
        user_id=user_id,
        list_id=new_list.id,
        activity_type="created",
        description=f"Duplicated list from '{original.title}' as '{new_title}'"
    )
    db.add(activity)
    db.commit()
    db.refresh(new_list)
    return format_list_summary(new_list)

def complete_list(db: Session, user_id: str, list_id: str) -> dict:
    shopping_list = get_list_by_id(db, user_id, list_id)
    shopping_list.status = "completed"
    shopping_list.completed_at = datetime.now(timezone.utc)
    shopping_list.updated_at = datetime.now(timezone.utc)

    activity = ShoppingActivity(
        user_id=user_id,
        list_id=shopping_list.id,
        activity_type="completed",
        description=f"Finished shopping for list '{shopping_list.title}'"
    )
    db.add(activity)
    db.commit()
    db.refresh(shopping_list)
    return format_list_summary(shopping_list)

def reuse_list(db: Session, user_id: str, list_id: str) -> dict:
    """
    Duplicates a completed list into a brand new active list,
    resetting all items to pending.
    """
    completed_list = get_list_by_id(db, user_id, list_id)
    new_title = f"{completed_list.title} (Reused)"
    new_list = ShoppingList(
        user_id=user_id,
        title=new_title,
        status="active"
    )
    db.add(new_list)
    db.flush()

    for item in completed_list.items:
        new_item = ShoppingItem(
            list_id=new_list.id,
            name=item.name,
            quantity=item.quantity,
            unit=item.unit,
            category=item.category,
            notes=item.notes,
            is_purchased=False
        )
        db.add(new_item)

    activity = ShoppingActivity(
        user_id=user_id,
        list_id=new_list.id,
        activity_type="reused",
        description=f"Reused shopping list '{completed_list.title}' into new list '{new_title}'"
    )
    db.add(activity)
    db.commit()
    db.refresh(new_list)
    return format_list_summary(new_list)

# Items operations
def add_single_item(db: Session, user_id: str, list_id: str, item_data: ShoppingItemCreate) -> ShoppingItem:
    shopping_list = get_list_by_id(db, user_id, list_id)
    new_item = ShoppingItem(
        list_id=shopping_list.id,
        name=item_data.name.strip(),
        quantity=item_data.quantity,
        unit=item_data.unit,
        category=item_data.category,
        notes=item_data.notes,
        is_purchased=item_data.is_purchased
    )
    db.add(new_item)
    shopping_list.updated_at = datetime.now(timezone.utc)
    db.commit()
    db.refresh(new_item)
    return new_item

def add_comma_separated_items(db: Session, user_id: str, list_id: str, raw_text: str) -> List[ShoppingItem]:
    shopping_list = get_list_by_id(db, user_id, list_id)
    # Split by comma or newline
    entries = [part.strip() for part in raw_text.replace("\n", ",").split(",") if part.strip()]
    created_items = []
    
    for entry in entries:
        parsed = parse_item_text(entry)
        item = ShoppingItem(
            list_id=shopping_list.id,
            name=parsed["name"],
            quantity=parsed["quantity"],
            unit=parsed["unit"],
            category=parsed["category"],
            notes=parsed["notes"],
            is_purchased=False
        )
        db.add(item)
        created_items.append(item)

    shopping_list.updated_at = datetime.now(timezone.utc)
    
    activity = ShoppingActivity(
        user_id=user_id,
        list_id=shopping_list.id,
        activity_type="item_added",
        description=f"Added {len(created_items)} items via quick entry to '{shopping_list.title}'"
    )
    db.add(activity)
    db.commit()
    for item in created_items:
        db.refresh(item)
    return created_items

def check_and_update_list_completion(db: Session, shopping_list: ShoppingList, user_id: str) -> bool:
    """
    Checks if all items in shopping_list are marked as purchased.
    - If all items are purchased (and list has >= 1 items), automatically marks list as completed.
    - If list was completed but an item was un-purchased, reverts status to active.
    - An empty list is never marked as completed.
    Returns True if the list transitioned to completed.
    """
    items = shopping_list.items
    total_items = len(items)
    all_purchased = total_items > 0 and all(i.is_purchased for i in items)

    if all_purchased and shopping_list.status != "completed":
        shopping_list.status = "completed"
        shopping_list.completed_at = datetime.now(timezone.utc)
        activity = ShoppingActivity(
            user_id=user_id,
            list_id=shopping_list.id,
            activity_type="completed",
            description=f"Shopping completed! List '{shopping_list.title}' moved to Completed Lists"
        )
        db.add(activity)
        return True
    elif not all_purchased and shopping_list.status == "completed":
        shopping_list.status = "active"
        shopping_list.completed_at = None
        return False

    return False

def update_item(db: Session, user_id: str, list_id: str, item_id: str, update_data: ShoppingItemUpdate) -> ShoppingItem:
    shopping_list = get_list_by_id(db, user_id, list_id)
    item = db.query(ShoppingItem).filter(ShoppingItem.id == item_id, ShoppingItem.list_id == shopping_list.id).first()
    if not item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Item not found")

    if update_data.name is not None:
        item.name = update_data.name.strip()
    if update_data.quantity is not None:
        item.quantity = max(0.1, update_data.quantity)
    if update_data.unit is not None:
        item.unit = update_data.unit
    if update_data.category is not None:
        item.category = update_data.category
    if update_data.notes is not None:
        item.notes = update_data.notes
    if update_data.is_purchased is not None:
        item.is_purchased = update_data.is_purchased

    item.updated_at = datetime.now(timezone.utc)
    shopping_list.updated_at = datetime.now(timezone.utc)
    check_and_update_list_completion(db, shopping_list, user_id)
    db.commit()
    db.refresh(item)
    return item

def toggle_item(db: Session, user_id: str, list_id: str, item_id: str) -> ShoppingItem:
    shopping_list = get_list_by_id(db, user_id, list_id)
    item = db.query(ShoppingItem).filter(ShoppingItem.id == item_id, ShoppingItem.list_id == shopping_list.id).first()
    if not item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Item not found")

    item.is_purchased = not item.is_purchased
    item.updated_at = datetime.now(timezone.utc)
    shopping_list.updated_at = datetime.now(timezone.utc)
    check_and_update_list_completion(db, shopping_list, user_id)
    db.commit()
    db.refresh(item)
    return item

def delete_item(db: Session, user_id: str, list_id: str, item_id: str) -> dict:
    shopping_list = get_list_by_id(db, user_id, list_id)
    item = db.query(ShoppingItem).filter(ShoppingItem.id == item_id, ShoppingItem.list_id == shopping_list.id).first()
    if not item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Item not found")

    db.delete(item)
    db.flush()
    # Refresh items association
    db.refresh(shopping_list)
    shopping_list.updated_at = datetime.now(timezone.utc)
    check_and_update_list_completion(db, shopping_list, user_id)
    db.commit()
    return {"message": "Item deleted successfully"}

