from pydantic import BaseModel, ConfigDict
from typing import List, Optional
from datetime import datetime
from app.schemas.shopping_list import ShoppingListResponse

class DashboardStatsResponse(BaseModel):
    total_lists: int
    active_lists: int
    completed_lists: int
    total_items_purchased: int
    completion_rate: float

class RecentActivityItem(BaseModel):
    id: str
    activity_type: str
    description: str
    created_at: datetime
    list_id: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)

class DashboardDataResponse(BaseModel):
    stats: DashboardStatsResponse
    active_lists: List[ShoppingListResponse]
    recently_completed: List[ShoppingListResponse]
    recent_activity: List[RecentActivityItem]
