from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.database import get_db
from app.models.user import User
from app.models.shopping_list import ShoppingList
from app.models.shopping_item import ShoppingItem
from app.models.activity import ShoppingActivity
from app.schemas.dashboard import DashboardDataResponse, DashboardStatsResponse
from app.services.auth_service import get_current_user
from app.services.list_service import format_list_summary

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])

@router.get("/summary", response_model=DashboardDataResponse)
def get_dashboard_summary(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Total lists
    all_lists = db.query(ShoppingList).filter(ShoppingList.user_id == current_user.id).order_by(ShoppingList.updated_at.desc()).all()
    
    active = [l for l in all_lists if l.status == "active"]
    completed = [l for l in all_lists if l.status == "completed"]
    
    # Total items purchased across all user lists
    total_purchased = db.query(func.count(ShoppingItem.id)).join(
        ShoppingList, ShoppingItem.list_id == ShoppingList.id
    ).filter(
        ShoppingList.user_id == current_user.id,
        ShoppingItem.is_purchased == True
    ).scalar() or 0

    total_items = db.query(func.count(ShoppingItem.id)).join(
        ShoppingList, ShoppingItem.list_id == ShoppingList.id
    ).filter(
        ShoppingList.user_id == current_user.id
    ).scalar() or 0

    rate = (total_purchased / total_items * 100.0) if total_items > 0 else 0.0

    # Recent activities
    activities = db.query(ShoppingActivity).filter(
        ShoppingActivity.user_id == current_user.id
    ).order_by(ShoppingActivity.created_at.desc()).limit(10).all()

    return {
        "stats": {
            "total_lists": len(all_lists),
            "active_lists": len(active),
            "completed_lists": len(completed),
            "total_items_purchased": total_purchased,
            "completion_rate": round(rate, 1)
        },
        "active_lists": [format_list_summary(l) for l in active],
        "recently_completed": [format_list_summary(l) for l in completed[:5]],
        "recent_activity": activities
    }

