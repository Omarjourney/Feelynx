from fastapi import FastAPI
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
import pathlib
from routes import ws

app = FastAPI()

# Include WebSocket router
app.include_router(ws.router)

# Determine the path to the front-end build
FRONTEND_DIR = pathlib.Path(__file__).resolve().parent / "public"

# Serve static assets
app.mount("/assets", StaticFiles(directory=FRONTEND_DIR), name="assets")

@app.get("/")
async def serve_index():
    return FileResponse(FRONTEND_DIR / "index.html")

@app.get("/health")
def health_check():
    return {"status": "ok"}

# Serve the front-end for any other path so client-side routing works.
@app.get("/{full_path:path}", include_in_schema=False)
async def catch_all(full_path: str):
    return FileResponse(FRONTEND_DIR / "index.html")
