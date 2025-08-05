from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
import pathlib
from routes import ws

app = FastAPI()

# Include WebSocket router
app.include_router(ws.router)

# Determine the path to the front-end build
FRONTEND_DIR = pathlib.Path(__file__).resolve().parent / "public"

@app.get("/health")
def health_check():
    return {"status": "ok"}

# Serve the front-end and static assets
app.mount("/", StaticFiles(directory=FRONTEND_DIR, html=True), name="static")
