import requests
import json

BASE = "http://localhost:8000/api"

def run_tests():
    print("=== DIGITICK FEATURE IMPROVEMENT TEST SUITE ===")

    # 1. Login
    login_res = requests.post(f"{BASE}/auth/login", json={
        "email": "chef.alex@example.com",
        "password": "Password123!"
    })
    assert login_res.status_code == 200, f"Login failed: {login_res.text}"
    token = login_res.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}
    print("[1] Auth Success: Logged in as chef.alex@example.com")

    # 2. Test Vegetable-Only Store Matching
    print("\n[2] Testing Intelligent Product Matching: Produce-Only List...")
    veg_list_res = requests.post(f"{BASE}/lists", json={"title": "Vegetable Only List"}, headers=headers)
    assert veg_list_res.status_code == 200
    veg_list_id = veg_list_res.json()["id"]

    requests.post(f"{BASE}/lists/{veg_list_id}/items", json={"name": "Organic Spinach", "category": "Produce"}, headers=headers)
    requests.post(f"{BASE}/lists/{veg_list_id}/items", json={"name": "Carrots", "category": "Produce"}, headers=headers)

    stores_veg = requests.get(f"{BASE}/stores/nearby?list_id={veg_list_id}&lat=37.7749&lng=-122.4194", headers=headers).json()
    store_names_veg = [s["name"] for s in stores_veg["stores"]]
    print(f"-> Stores returned for Produce-Only: {store_names_veg}")
    # Farmers Mart and Metro Supermarket should be present; Bakery and Pharmacy must NOT be present!
    assert "Fresh Harvest Farmers Mart" in store_names_veg, "Farmers Mart should be recommended for produce"
    assert "HealthGuard Pharmacy & Wellness" not in store_names_veg, "Pharmacy should NOT be recommended for produce-only"
    assert "Artisan Daily Bread & Dairy" not in store_names_veg, "Bakery/Dairy should NOT be recommended for produce-only"
    print("-> PASS: Irrelevant stores (Pharmacy, Bakery) were successfully filtered out!")

    # 3. Test Personal-Care-Only Store Matching
    print("\n[3] Testing Intelligent Product Matching: Personal-Care-Only List...")
    care_list_res = requests.post(f"{BASE}/lists", json={"title": "Personal Care List"}, headers=headers)
    assert care_list_res.status_code == 200
    care_list_id = care_list_res.json()["id"]

    requests.post(f"{BASE}/lists/{care_list_id}/items", json={"name": "Shampoo", "category": "Personal Care"}, headers=headers)
    requests.post(f"{BASE}/lists/{care_list_id}/items", json={"name": "Toothpaste", "category": "Personal Care"}, headers=headers)

    stores_care = requests.get(f"{BASE}/stores/nearby?list_id={care_list_id}&lat=37.7749&lng=-122.4194", headers=headers).json()
    store_names_care = [s["name"] for s in stores_care["stores"]]
    print(f"-> Stores returned for Personal Care Only: {store_names_care}")
    assert "HealthGuard Pharmacy & Wellness" in store_names_care, "Pharmacy should be recommended for personal care"
    assert "Fresh Harvest Farmers Mart" not in store_names_care, "Vegetable shop should NOT appear for shampoo/toothpaste!"
    assert "Artisan Daily Bread & Dairy" not in store_names_care, "Bakery should NOT appear for shampoo/toothpaste!"
    print("-> PASS: Vegetable shop correctly excluded when list contains only personal care products!")

    # 4. Test Automatic List Completion
    print("\n[4] Testing Automatic Movement into Completed Lists...")
    trip_res = requests.post(f"{BASE}/lists", json={"title": "Weekend Market Trip"}, headers=headers)
    trip_id = trip_res.json()["id"]

    i1 = requests.post(f"{BASE}/lists/{trip_id}/items", json={"name": "Almond Milk", "category": "Dairy & Eggs"}, headers=headers).json()
    i2 = requests.post(f"{BASE}/lists/{trip_id}/items", json={"name": "Whole Wheat Bread", "category": "Bakery"}, headers=headers).json()

    # Mark 1 of 2 purchased
    requests.patch(f"{BASE}/lists/{trip_id}/items/{i1['id']}/toggle", headers=headers)
    check1 = requests.get(f"{BASE}/lists/{trip_id}", headers=headers).json()
    assert check1["status"] == "active", "List should remain active while items are pending"
    print("-> Step 1: 1 of 2 items checked -> status is correctly 'active'")

    # Mark 2 of 2 purchased (all completed)
    requests.patch(f"{BASE}/lists/{trip_id}/items/{i2['id']}/toggle", headers=headers)
    check2 = requests.get(f"{BASE}/lists/{trip_id}", headers=headers).json()
    assert check2["status"] == "completed", "List must automatically transition to 'completed'"
    assert check2["completed_at"] is not None, "Completed timestamp must be set"
    print("-> Step 2: Final item checked -> list automatically moved to 'completed' with timestamp!")

    # Verify presence in completed lists query and absence from active lists
    active_lists = requests.get(f"{BASE}/lists?status=active", headers=headers).json()
    completed_lists = requests.get(f"{BASE}/lists?status=completed", headers=headers).json()
    assert not any(l["id"] == trip_id for l in active_lists), "Completed list must be absent from Active Lists"
    assert any(l["id"] == trip_id for l in completed_lists), "Completed list must be present in Completed Lists"
    print("-> Step 3: Verified removal from Active Lists and presence in Completed Lists")

    # Step 4: Unmark an item -> should revert back to active
    requests.patch(f"{BASE}/lists/{trip_id}/items/{i2['id']}/toggle", headers=headers)
    check3 = requests.get(f"{BASE}/lists/{trip_id}", headers=headers).json()
    assert check3["status"] == "active", "Unmarking an item must revert status to 'active'"
    print("-> Step 4: Unmarked item -> status automatically reverted to 'active'!")

    # 5. Reuse List
    print("\n[5] Testing Completed List Reuse...")
    # Re-complete
    requests.patch(f"{BASE}/lists/{trip_id}/items/{i2['id']}/toggle", headers=headers)
    reuse_res = requests.post(f"{BASE}/lists/{trip_id}/reuse", headers=headers)
    assert reuse_res.status_code == 200
    reused = reuse_res.json()
    assert reused["status"] == "active", "Reused list must be active"
    assert "Reused" in reused["title"]
    # Check items on reused list
    reused_detail = requests.get(f"{BASE}/lists/{reused['id']}", headers=headers).json()
    assert all(not i["is_purchased"] for i in reused_detail["items"]), "All items in reused list must be reset to pending"
    print(f"-> Reused list '{reused['title']}' created with all items reset to pending (is_purchased=False)")

    print("\n=== ALL SCENARIOS VERIFIED SUCCESSFULLY ===")

if __name__ == "__main__":
    run_tests()
