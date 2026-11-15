import math
from typing import List, Dict, Optional
from sqlalchemy.orm import Session
from app.config import settings
from app.models.shopping_list import ShoppingList

# Reference store categories and what products they generally stock
STORE_CATEGORY_MAPPING = {
    "Produce": ["Vegetable Shop", "Fruit Mart", "Farmers Market", "Supermarket", "Hypermarket", "Organic Grocery"],
    "Dairy & Eggs": ["Dairy Shop", "Milk Booth", "Bakery & Dairy", "Supermarket", "Hypermarket", "Convenience Store", "Grocery Store"],
    "Bakery": ["Bakery", "Artisan Bakery", "Supermarket", "Hypermarket", "Cafe & Bakery"],
    "Pantry & Staples": ["Grocery Store", "Supermarket", "Hypermarket", "Department Store", "Provision Store"],
    "Beverages": ["Beverage Mart", "Liquor & Wine Store", "Supermarket", "Hypermarket", "Convenience Store"],
    "Meat & Seafood": ["Butcher Shop", "Meat Market", "Fishmonger", "Supermarket", "Hypermarket"],
    "Snacks": ["Convenience Store", "Supermarket", "Hypermarket", "Snack Bar", "Grocery Store"],
    "Personal Care": ["Pharmacy", "Chemist & Drugstore", "Cosmetics & Beauty", "Supermarket", "Hypermarket"],
    "Household": ["Hardware & Home Mart", "Supermarket", "Hypermarket", "Department Store", "General Store"],
    "Other": ["General Store", "Supermarket", "Hypermarket"]
}

# Realistic mock stores for fallback development when GOOGLE_MAPS_API_KEY is not set
FALLBACK_STORES = [
    {
        "id": "store-1",
        "name": "Fresh Harvest Farmers Mart",
        "category": "Vegetable & Fruit Mart",
        "address": "42 Green Avenue, Central Market",
        "distance_km": 0.4,
        "rating": 4.7,
        "open_now": True,
        "phone": "+1 (555) 234-8901",
        "website": "https://freshharvestexample.com",
        "lat": 37.7749,
        "lng": -122.4194,
        "supported_categories": ["Produce"]
    },
    {
        "id": "store-2",
        "name": "Artisan Daily Bread & Dairy",
        "category": "Dairy & Bakery",
        "address": "108 Baker Street, Suite B",
        "distance_km": 0.7,
        "rating": 4.8,
        "open_now": True,
        "phone": "+1 (555) 345-6789",
        "website": "https://artisandailyexample.com",
        "lat": 37.7780,
        "lng": -122.4140,
        "supported_categories": ["Dairy & Eggs", "Bakery", "Beverages"]
    },
    {
        "id": "store-3",
        "name": "Metro Supermarket & Grocers",
        "category": "Supermarket",
        "address": "250 Commercial Boulevard",
        "distance_km": 1.1,
        "rating": 4.5,
        "open_now": True,
        "phone": "+1 (555) 789-0123",
        "website": "https://metrosupermarketexample.com",
        "lat": 37.7810,
        "lng": -122.4250,
        "supported_categories": ["Produce", "Dairy & Eggs", "Bakery", "Pantry & Staples", "Beverages", "Meat & Seafood", "Snacks", "Personal Care", "Household", "Other"]
    },
    {
        "id": "store-4",
        "name": "HealthGuard Pharmacy & Wellness",
        "category": "Pharmacy & Personal Care",
        "address": "77 Wellness Way",
        "distance_km": 1.4,
        "rating": 4.6,
        "open_now": True,
        "phone": "+1 (555) 890-1234",
        "website": "https://healthguardpharmacyexample.com",
        "lat": 37.7710,
        "lng": -122.4120,
        "supported_categories": ["Personal Care", "Household"]
    },
    {
        "id": "store-5",
        "name": "Cornerstone Provision & General Store",
        "category": "General Store",
        "address": "15 Neighborhood Square",
        "distance_km": 1.8,
        "rating": 4.2,
        "open_now": False,
        "phone": "+1 (555) 901-2345",
        "website": None,
        "lat": 37.7680,
        "lng": -122.4210,
        "supported_categories": ["Pantry & Staples", "Dairy & Eggs", "Beverages", "Snacks", "Household"]
    }
]

def match_items_to_store(store_categories: List[str], user_items: List[dict]) -> List[str]:
    """
    Given a store's supported product categories and the user's shopping items,
    returns the list of item names that match the store's category.
    """
    suggested = []
    for item in user_items:
        category = item.get("category", "Other")
        if category in store_categories:
            suggested.append(item.get("name"))
    return suggested

def get_nearby_stores_for_user(
    db: Session,
    user_id: str,
    list_id: Optional[str] = None,
    lat: Optional[float] = None,
    lng: Optional[float] = None,
    query: Optional[str] = None
) -> dict:
    """
    Finds nearby stores and matches products from the user's active shopping list.
    """
    # 1. Fetch user items for matching
    user_items = []
    if list_id:
        shopping_list = db.query(ShoppingList).filter(ShoppingList.id == list_id, ShoppingList.user_id == user_id).first()
        if shopping_list:
            user_items = [{"name": i.name, "category": i.category} for i in shopping_list.items if not i.is_purchased]
    else:
        # Grab unpurchased items across all active lists
        active_lists = db.query(ShoppingList).filter(ShoppingList.user_id == user_id, ShoppingList.status == "active").all()
        for sl in active_lists:
            for i in sl.items:
                if not i.is_purchased:
                    user_items.append({"name": i.name, "category": i.category})

    is_live = False
    stores = []

    # If Google Maps API key is configured, can perform live Google Places API search
    if settings.GOOGLE_MAPS_API_KEY and lat and lng:
        try:
            import urllib.request
            import urllib.parse
            import json

            # Google Places Nearby Search
            places_url = (
                f"https://maps.googleapis.com/maps/api/place/nearbysearch/json?"
                f"location={lat},{lng}&radius=3000&type=grocery_or_supermarket&key={settings.GOOGLE_MAPS_API_KEY}"
            )
            req = urllib.request.Request(places_url)
            with urllib.request.urlopen(req, timeout=10) as resp:
                data = json.loads(resp.read().decode("utf-8"))
                if data.get("status") == "OK":
                    is_live = True
                    for place in data.get("results", [])[:10]:
                        name = place.get("name", "Store")
                        types = place.get("types", [])
                        
                        # Map Google types to our categories
                        supported = ["Other"]
                        category_name = "Supermarket"
                        if "supermarket" in types or "grocery_or_supermarket" in types:
                            category_name = "Supermarket"
                            supported = ["Produce", "Dairy & Eggs", "Bakery", "Pantry & Staples", "Beverages", "Meat & Seafood", "Snacks", "Personal Care", "Household", "Other"]
                        elif "pharmacy" in types:
                            category_name = "Pharmacy & Personal Care"
                            supported = ["Personal Care", "Household"]
                        elif "bakery" in types:
                            category_name = "Bakery"
                            supported = ["Bakery", "Dairy & Eggs"]

                        store_lat = place.get("geometry", {}).get("location", {}).get("lat", lat)
                        store_lng = place.get("geometry", {}).get("location", {}).get("lng", lng)
                        
                        # Distance approx in km
                        dist = round(math.sqrt((store_lat - lat)**2 + (store_lng - lng)**2) * 111, 1)

                        store_obj = {
                            "id": place.get("place_id", str(len(stores) + 1)),
                            "name": name,
                            "category": category_name,
                            "address": place.get("vicinity", "Nearby area"),
                            "distance_km": dist,
                            "rating": place.get("rating", 4.3),
                            "open_now": place.get("opening_hours", {}).get("open_now", True),
                            "phone": None,
                            "website": None,
                            "lat": store_lat,
                            "lng": store_lng,
                            "supported_categories": supported,
                            "suggested_items": match_items_to_store(supported, user_items)
                        }
                        stores.append(store_obj)
        except Exception:
            # Live call failed, fall back safely
            is_live = False

    if not stores:
        # Use development fallback stores with matched items
        base_lat = lat if lat else 37.7749
        base_lng = lng if lng else -122.4194

        # Spatial offsets corresponding to ~0.4km, ~0.7km, ~1.1km, ~1.4km, ~1.8km from user
        offsets = [
            (0.003, 0.002, 0.4),
            (-0.004, 0.005, 0.7),
            (0.007, -0.008, 1.1),
            (-0.009, -0.010, 1.4),
            (0.012, 0.011, 1.8)
        ]

        for idx, fs in enumerate(FALLBACK_STORES):
            store_copy = dict(fs)
            matched = match_items_to_store(store_copy["supported_categories"], user_items)
            store_copy["suggested_items"] = matched

            # Filter rule: only display stores that match at least one product from user's shopping list
            if user_items and len(matched) == 0:
                continue

            if lat and lng and idx < len(offsets):
                d_lat, d_lng, dist_km = offsets[idx]
                store_copy["lat"] = round(base_lat + d_lat, 6)
                store_copy["lng"] = round(base_lng + d_lng, 6)
                store_copy["distance_km"] = dist_km

            stores.append(store_copy)
    else:
        # For live stores as well, filter to only those that match user items
        if user_items:
            stores = [s for s in stores if len(s.get("suggested_items", [])) > 0]

    has_api_key = bool(settings.GOOGLE_MAPS_API_KEY)
    status_message = None
    if not has_api_key:
        status_message = "Google Places API key is not configured in backend/.env. Displaying sample neighborhood grocers for development testing."

    return {
        "location_query": query or ("Current Location" if lat else "Downtown Area"),
        "user_lat": lat or 37.7749,
        "user_lng": lng or -122.4194,
        "stores": stores,
        "is_live_google_maps": is_live,
        "configured": has_api_key,
        "message": status_message,
        "disclaimer": (
            "These suggestions are based on store categories. Actual product availability may vary. Please contact the store to confirm."
        )
    }

