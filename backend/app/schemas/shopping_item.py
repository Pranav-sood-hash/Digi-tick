from pydantic import BaseModel, ConfigDict
from typing import Optional, List
from datetime import datetime

class ShoppingItemBase(BaseModel):
    name: str
    quantity: float = 1.0
    unit: str = "item"
    category: str = "Other"
    notes: Optional[str] = None
    is_purchased: bool = False

class ShoppingItemCreate(ShoppingItemBase):
    pass

class ShoppingItemUpdate(BaseModel):
    name: Optional[str] = None
    quantity: Optional[float] = None
    unit: Optional[str] = None
    category: Optional[str] = None
    notes: Optional[str] = None
    is_purchased: Optional[bool] = None

class ShoppingItemResponse(ShoppingItemBase):
    id: str
    list_id: str
    created_at: datetime
    updated_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)

class BulkItemCommaRequest(BaseModel):
    text: str

class BulkItemsAddRequest(BaseModel):
    items: List[ShoppingItemCreate]
