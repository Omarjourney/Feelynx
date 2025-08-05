import os
import sys
from pathlib import Path
from fastapi.testclient import TestClient

sys.path.append(os.path.dirname(os.path.dirname(__file__)))
from main import app

client = TestClient(app)

def test_root_serves_index_html():
    response = client.get("/")
    assert response.status_code == 200
    index_path = Path(__file__).resolve().parent.parent / "public" / "index.html"
    assert response.text == index_path.read_text()

def test_static_asset_served():
    response = client.get("/assets/style.css")
    assert response.status_code == 200
    asset_path = Path(__file__).resolve().parent.parent / "public" / "style.css"
    assert response.text == asset_path.read_text()
