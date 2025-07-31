from fastapi import FastAPI
from routes import ws

app = FastAPI()

# Include WebSocket router
app.include_router(ws.router)

@app.get("/health")
def health_check():
    return {"status": "ok"}
