import requests
import json

BASE_URL = "http://localhost:8000/api"

def run_e2e_food_test():
    print("=== STARTING DIGITICK E2E FOOD & STORE TEST ===")

    # 1. Register or Login
    user_payload = {
        "email": "chef.alex@example.com",
        "password": "Password123!",
        "full_name": "Chef Alex Johnson"
    }

    print("\n[Step 1] Authenticating user (chef.alex@example.com)...")
    res = requests.post(f"{BASE_URL}/auth/register", json=user_payload)
    if res.status_code == 200:
        data = res.json()
        token = data["access_token"]
        print(f"-> Successfully registered new account: {data['user']['email']} (ID: {data['user']['id']})")
    elif res.status_code == 400:
        # Already registered, log in
        login_res = requests.post(f"{BASE_URL}/auth/login", json={
            "email": user_payload["email"],
            "password": user_payload["password"]
        })
        assert login_res.status_code == 200, f"Login failed: {login_res.text}"
        data = login_res.json()
        token = data["access_token"]
        print(f"-> Successfully logged in existing account: {data['user']['email']}")
    else:
        raise Exception(f"Auth error: {res.status_code} {res.text}")

    headers = {"Authorization": f"Bearer {token}"}

    # Verify session profile
    me_res = requests.get(f"{BASE_URL}/auth/me", headers=headers)
    assert me_res.status_code == 200
    user_profile = me_res.json()
    print(f"-> Verified user session: {user_profile['full_name']} ({user_profile['email']})")

    # 2. Create Shopping List: "Weekly Food & Pantry Essentials"
    print("\n[Step 2] Creating shopping list 'Weekly Food & Pantry Essentials'...")
    list_res = requests.post(
        f"{BASE_URL}/lists",
        json={"title": "Weekly Food & Pantry Essentials"},
        headers=headers
    )
    assert list_res.status_code == 200, f"Failed to create list: {list_res.text}"
    created_list = list_res.json()
    list_id = created_list["id"]
    print(f"-> Created List ID: {list_id} | Title: '{created_list['title']}'")

    # 3. Add 10 random food products
    food_products = [
        {"name": "Organic Apples", "quantity": 2.0, "unit": "kg", "category": "Produce", "notes": "Crisp red gala"},
        {"name": "Whole Milk", "quantity": 1.0, "unit": "liter", "category": "Dairy & Eggs", "notes": "Pasteurized fresh"},
        {"name": "Sourdough Bread", "quantity": 1.0, "unit": "loaf", "category": "Bakery", "notes": "Artisan bakery"},
        {"name": "Cheddar Cheese", "quantity": 200.0, "unit": "g", "category": "Dairy & Eggs", "notes": "Aged sharp"},
        {"name": "Fresh Farm Eggs", "quantity": 12.0, "unit": "item", "category": "Dairy & Eggs", "notes": "Grade A free-range"},
        {"name": "Extra Virgin Olive Oil", "quantity": 500.0, "unit": "ml", "category": "Pantry & Staples", "notes": "Cold pressed"},
        {"name": "Chicken Breast", "quantity": 1.0, "unit": "kg", "category": "Meat & Seafood", "notes": "Boneless, skinless"},
        {"name": "Basmati Rice", "quantity": 1.0, "unit": "kg", "category": "Pantry & Staples", "notes": "Long grain aromatic"},
        {"name": "Fresh Red Tomatoes", "quantity": 500.0, "unit": "g", "category": "Produce", "notes": "Ripe vine tomatoes"},
        {"name": "Greek Yogurt", "quantity": 2.0, "unit": "box", "category": "Dairy & Eggs", "notes": "Plain unsweetened"}
    ]

    print(f"\n[Step 3] Adding {len(food_products)} food items to list...")
    added_items = []
    for idx, item in enumerate(food_products, 1):
        item_res = requests.post(f"{BASE_URL}/lists/{list_id}/items", json=item, headers=headers)
        assert item_res.status_code == 200, f"Failed to add item {item['name']}: {item_res.text}"
        added = item_res.json()
        added_items.append(added)
        print(f"   {idx:2d}. {added['name']:<24} | Qty: {added['quantity']} {added['unit']:<6} | Category: {added['category']:<16} | Status: Pending")

    # 4. Check list status & toggle items
    print("\n[Step 4] Checking list details and testing item purchase toggle...")
    detail_res = requests.get(f"{BASE_URL}/lists/{list_id}", headers=headers)
    assert detail_res.status_code == 200
    list_data = detail_res.json()
    print(f"-> Total Items: {list_data['total_items']} | Completed: {list_data['completed_items']} | Progress: {list_data['progress_percent']}%")

    # Toggle 3 items as purchased (Apples, Milk, Bread)
    items_to_toggle = added_items[:3]
    for it in items_to_toggle:
        toggle_res = requests.patch(f"{BASE_URL}/lists/{list_id}/items/{it['id']}/toggle", headers=headers)
        assert toggle_res.status_code == 200
        toggled = toggle_res.json()
        print(f"-> Toggled '{toggled['name']}': is_purchased = {toggled['is_purchased']}")

    # Re-fetch list to verify progress calculation
    detail_res = requests.get(f"{BASE_URL}/lists/{list_id}", headers=headers)
    updated_list = detail_res.json()
    print(f"-> Updated List: Completed {updated_list['completed_items']}/{updated_list['total_items']} items ({updated_list['progress_percent']}%)")
    assert updated_list["completed_items"] == 3
    assert updated_list["progress_percent"] == 30.0

    # 5. Test Store Discovery and Location Matching for this List
    print("\n[Step 5] Discovering nearby grocery stores and matching against unpurchased food products...")
    stores_res = requests.get(f"{BASE_URL}/stores/nearby?list_id={list_id}&lat=37.7749&lng=-122.4194", headers=headers)
    assert stores_res.status_code == 200
    store_data = stores_res.json()

    print(f"-> Location: {store_data['location_query']} (Lat: {store_data['user_lat']}, Lng: {store_data['user_lng']})")
    print(f"-> Stores Found: {len(store_data['stores'])}")
    print(f"-> Mandatory Disclaimer: \"{store_data['disclaimer']}\"")
    print(f"-> Live Google Maps Connected: {store_data['is_live_google_maps']}")

    print("\n--- NEARBY STORES & SUGGESTED FOOD PRODUCTS ---")
    for s in store_data["stores"]:
        print(f"\n🏪 {s['name']}")
        print(f"   Category: {s['category']}")
        print(f"   Address: {s['address']}")
        print(f"   Distance: {s['distance_km']} km | Rating: {s['rating']} ⭐ | Open Now: {'Yes' if s['open_now'] else 'No'}")
        print(f"   Supported Departments: {', '.join(s['supported_categories'])}")
        suggested = s.get("suggested_items", [])
        if suggested:
            print(f"   🛒 Matched Food Items from List ({len(suggested)}): {', '.join(suggested)}")
        else:
            print("   🛒 Matched Food Items: None matching this store's specific departments")

    # 6. Verify Dashboard Summary
    print("\n[Step 6] Verifying Dashboard Summary & Statistics...")
    dash_res = requests.get(f"{BASE_URL}/dashboard/summary", headers=headers)
    assert dash_res.status_code == 200
    dash_data = dash_res.json()
    stats = dash_data["stats"]
    print(f"-> Total Lists: {stats['total_lists']}")
    print(f"-> Active Lists: {stats['active_lists']}")
    print(f"-> Items Purchased: {stats['total_items_purchased']}")
    print(f"-> Recent Activities Recorded: {len(dash_data['recent_activity'])}")
    for act in dash_data['recent_activity'][:4]:
        print(f"   • {act['description']}")

    print("\n=== ALL DIGITICK E2E TESTS COMPLETED SUCCESSFULLY ===")

if __name__ == "__main__":
    run_e2e_food_test()
