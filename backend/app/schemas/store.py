from pydantic import BaseModel
from typing import List, Optional

class NearbyStore(BaseModel):
    id: str
    name: str
    category: str # "Supermarket", "Vegetable & Fruit Mart", "Dairy & Bakery", "Pharmacy & Personal Care", "General Store"
    address: str
    distance_km: float
    rating: float
    open_now: bool
    phone: Optional[str] = None
    website: Optional[str] = None
    lat: float
    lng: float
    supported_categories: List[str] # Categories of goods this store typically stocks
    suggested_items: List[str] = [] # Items from user's shopping list matching this store's categories

class NearbyStoresResponse(BaseModel):
    location_query: str
    user_lat: Optional[float] = None
    user_lng: Optional[float] = None
    stores: List[NearbyStore]
    disclaimer: str = (
        "Category-based product suggestions only. Actual in-store product availability, "
        "brands, and pricing are not guaranteed. Digitick does not track live merchant inventory."
    )
    is_live_google_maps: bool = False
    configured: bool = True
    message: Optional[str] = None

