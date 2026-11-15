from pydantic import BaseModel, ConfigDict
from typing import Optional, List
from datetime import datetime
from app.schemas.shopping_item import ShoppingItemResponse

class ShoppingListBase(BaseModel):
    title: str

class ShoppingListCreate(ShoppingListBase):
    pass

class ShoppingListUpdate(BaseModel):
    title: Optional[str] = None
    status: Optional[str] = None # "active", "completed", "archived"

class ShoppingListResponse(ShoppingListBase):
    id: str
    user_id: str
    status: str
    completed_at: Optional[datetime] = None
    created_at: datetime
    updated_at: Optional[datetime] = None
    total_items: int = 0
    completed_items: int = 0
    progress_percent: float = 0.0

    model_config = ConfigDict(from_attributes=True)

class ShoppingListDetailResponse(ShoppingListResponse):
    items: List[ShoppingItemResponse] = []
