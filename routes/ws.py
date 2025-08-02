from fastapi import APIRouter, WebSocket, WebSocketDisconnect

router = APIRouter()


class ConnectionManager:
    """Track active WebSocket connections and handle broadcasts."""

    def __init__(self) -> None:
        self.connections: set[WebSocket] = set()

    async def connect(self, websocket: WebSocket) -> None:
        await websocket.accept()
        self.connections.add(websocket)

    def disconnect(self, websocket: WebSocket) -> None:
        self.connections.discard(websocket)

    async def broadcast(self, message: str, sender: WebSocket) -> None:
        for conn in list(self.connections):
            if conn is sender:
                continue
            try:
                await conn.send_text(message)
            except Exception:
                # Drop connections that cannot receive messages
                self.disconnect(conn)


manager = ConnectionManager()


@router.websocket("/ws")
async def websocket_endpoint(ws: WebSocket):
    await manager.connect(ws)
    try:
        while True:
            data = await ws.receive_text()
            await manager.broadcast(data, ws)
    except WebSocketDisconnect:
        pass
    finally:
        manager.disconnect(ws)
