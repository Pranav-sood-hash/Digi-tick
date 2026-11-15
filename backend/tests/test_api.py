import pytest
from fastapi.testclient import TestClient
import os

# Set testing environment
os.environ["DATABASE_URL"] = "sqlite:///./test_digitick.db"
from app.main import app
from app.database import Base, engine

client = TestClient(app)

@pytest.fixture(autouse=True, scope="module")
def setup_test_db():
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)
    engine.dispose()
    if os.path.exists("./test_digitick.db"):
        try:
            os.remove("./test_digitick.db")
        except OSError:
            pass

def test_health():
    res = client.get("/api/health")
    assert res.status_code == 200
    assert res.json()["status"] == "healthy"

def test_auth_and_default_list():
    # 1. Register
    reg_res = client.post("/api/auth/register", json={
        "email": "testuser@example.com",
        "password": "Password123!",
        "full_name": "Test Shopper"
    })
    assert reg_res.status_code == 200
    data = reg_res.json()
    token = data["access_token"]
    assert token is not None
    headers = {"Authorization": f"Bearer {token}"}

    # 2. Check current user
    me_res = client.get("/api/auth/me", headers=headers)
    assert me_res.status_code == 200
    assert me_res.json()["email"] == "testuser@example.com"

    # 3. Check that default list was automatically created!
    lists_res = client.get("/api/lists", headers=headers)
    assert lists_res.status_code == 200
    lists = lists_res.json()
    assert len(lists) >= 1
    default_list = lists[0]
    assert default_list["title"] == "Weekly Essentials"
    assert default_list["status"] == "active"

def test_shopping_list_and_items():
    # Login
    login_res = client.post("/api/auth/login", json={
        "email": "testuser@example.com",
        "password": "Password123!"
    })
    assert login_res.status_code == 200
    token = login_res.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # Create new list
    create_res = client.post("/api/lists", json={"title": "Supermarket Run"}, headers=headers)
    assert create_res.status_code == 200
    list_id = create_res.json()["id"]

    # Comma-separated quick entry: Apple, Banana, Milk 2 packets, 1 loaf Bread, 5 Eggs
    comma_res = client.post(
        f"/api/lists/{list_id}/items/quick-comma",
        json={"text": "Apple, Banana, Milk 2 packets, 1 loaf Bread, 5 Eggs"},
        headers=headers
    )
    assert comma_res.status_code == 200
    items = comma_res.json()
    assert len(items) == 5

    # Check categories & quantities were detected
    names = [i["name"] for i in items]
    assert "Apple" in names
    assert "Milk" in names
    
    # Toggle an item
    apple_item = next(i for i in items if i["name"] == "Apple")
    toggle_res = client.patch(f"/api/lists/{list_id}/items/{apple_item['id']}/toggle", headers=headers)
    assert toggle_res.status_code == 200
    assert toggle_res.json()["is_purchased"] is True

    # Check list detail and progress
    detail_res = client.get(f"/api/lists/{list_id}", headers=headers)
    assert detail_res.status_code == 200
    detail = detail_res.json()
    assert detail["total_items"] == 5
    assert detail["completed_items"] == 1
    assert detail["progress_percent"] == 20.0

    # Complete list
    comp_res = client.post(f"/api/lists/{list_id}/complete", headers=headers)
    assert comp_res.status_code == 200
    assert comp_res.json()["status"] == "completed"

    # Reuse list
    reuse_res = client.post(f"/api/lists/{list_id}/reuse", headers=headers)
    assert reuse_res.status_code == 200
    new_reused_list = reuse_res.json()
    assert new_reused_list["status"] == "active"
    assert "Reused" in new_reused_list["title"]

def test_store_discovery():
    login_res = client.post("/api/auth/login", json={
        "email": "testuser@example.com",
        "password": "Password123!"
    })
    token = login_res.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    stores_res = client.get("/api/stores/nearby", headers=headers)
    assert stores_res.status_code == 200
    data = stores_res.json()
    assert len(data["stores"]) > 0
    assert "disclaimer" in data
    assert "categories" in data["disclaimer"].lower() or "availability" in data["disclaimer"].lower()

def test_automatic_list_completion():
    login_res = client.post("/api/auth/login", json={
        "email": "testuser@example.com",
        "password": "Password123!"
    })
    token = login_res.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # Create a list with 2 items
    list_res = client.post("/api/lists", json={"title": "Auto Complete Test"}, headers=headers)
    assert list_res.status_code == 200
    list_id = list_res.json()["id"]

    item1_res = client.post(f"/api/lists/{list_id}/items", json={"name": "Milk", "category": "Dairy & Eggs"}, headers=headers)
    item2_res = client.post(f"/api/lists/{list_id}/items", json={"name": "Bread", "category": "Bakery"}, headers=headers)
    item1_id = item1_res.json()["id"]
    item2_id = item2_res.json()["id"]

    # Mark 1 item as purchased -> list should still be active
    client.patch(f"/api/lists/{list_id}/items/{item1_id}/toggle", headers=headers)
    status_res1 = client.get(f"/api/lists/{list_id}", headers=headers)
    assert status_res1.json()["status"] == "active"

    # Mark the 2nd (final) item as purchased -> list should automatically become completed!
    client.patch(f"/api/lists/{list_id}/items/{item2_id}/toggle", headers=headers)
    status_res2 = client.get(f"/api/lists/{list_id}", headers=headers)
    assert status_res2.json()["status"] == "completed"
    assert status_res2.json()["completed_at"] is not None

    # Unmark an item -> list should revert to active!
    client.patch(f"/api/lists/{list_id}/items/{item1_id}/toggle", headers=headers)
    status_res3 = client.get(f"/api/lists/{list_id}", headers=headers)
    assert status_res3.json()["status"] == "active"
    assert status_res3.json()["completed_at"] is None

def test_profile_avatar_upload():
    login_res = client.post("/api/auth/login", json={
        "email": "testuser@example.com",
        "password": "Password123!"
    })
    token = login_res.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # Upload test avatar
    import io
    fake_image = io.BytesIO(b"\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR\x00\x00\x00\x01\x00\x00\x00\x01\x08\x06\x00\x00\x00\x1f\x15c4\x00\x00\x00\nIDATx\x9cc\x00\x01\x00\x00\x05\x00\x01\r\n-\xb4\x00\x00\x00\x00IEND\xaeB`\x82")
    files = {"file": ("avatar.png", fake_image, "image/png")}

    res = client.post("/api/auth/profile/avatar", headers=headers, files=files)
    assert res.status_code == 200
    profile = res.json()
    assert profile["avatar_url"].startswith("/uploads/")

def test_manual_auth_validations():
    # 1. Unknown email attempts manual login -> 404
    unknown_login = client.post("/api/auth/login", json={
        "email": "nonexistent.user.99@example.com",
        "password": "Password123!"
    })
    assert unknown_login.status_code == 404
    assert "No account found" in unknown_login.json()["detail"]

    # 2. Existing user with wrong password -> 401
    wrong_pwd = client.post("/api/auth/login", json={
        "email": "testuser@example.com",
        "password": "WrongPassword999!"
    })
    assert wrong_pwd.status_code == 401
    assert "Incorrect email or password" in wrong_pwd.json()["detail"]

    # 3. Existing user with correct password -> 200 OK
    correct_login = client.post("/api/auth/login", json={
        "email": "testuser@example.com",
        "password": "Password123!"
    })
    assert correct_login.status_code == 200
    token = correct_login.json()["access_token"]
    assert token is not None

    # 4. Shopping data remains intact
    headers = {"Authorization": f"Bearer {token}"}
    lists_res = client.get("/api/lists", headers=headers)
    assert lists_res.status_code == 200
    assert len(lists_res.json()) >= 1

def test_google_auth_flows():
    # 1. Unknown Google user clicks Login -> rejected with 404
    login_attempt = client.post("/api/auth/google", json={
        "email": "unregistered.google@gmail.com",
        "flow": "login"
    })
    assert login_attempt.status_code == 404
    assert "Your account doesn't exist in Digitick yet" in login_attempt.json()["detail"]

    # 2. Existing email/password user tries to Google Login -> rejected with 400 (no auto-linking)
    email_user_attempt = client.post("/api/auth/google", json={
        "email": "testuser@example.com",
        "flow": "login"
    })
    assert email_user_attempt.status_code == 400
    assert "email and password" in email_user_attempt.json()["detail"]

    # 3. New user signs up with Google -> Success (200 OK)
    signup_res = client.post("/api/auth/google", json={
        "email": "brandnew.google@gmail.com",
        "full_name": "New Google Shopper",
        "avatar_url": "https://lh3.googleusercontent.com/photo.jpg",
        "flow": "signup"
    })
    assert signup_res.status_code == 200
    user_data = signup_res.json()["user"]
    assert user_data["auth_provider"] == "google"
    assert user_data["email"] == "brandnew.google@gmail.com"

    # 4. Now that account is registered with Google, Google Login must succeed!
    google_login_res = client.post("/api/auth/google", json={
        "email": "brandnew.google@gmail.com",
        "flow": "login"
    })
    assert google_login_res.status_code == 200
    assert "access_token" in google_login_res.json()
