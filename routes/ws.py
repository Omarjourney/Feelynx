from fastapi import APIRouter, WebSocket, WebSocketDisconnect

router = APIRouter()

# Store active WebSocket connections
connections = []

@router.websocket("/ws")
async def websocket_endpoint(ws: WebSocket):
    await ws.accept()
    connections.append(ws)
    try:
        while True:
            data = await ws.receive_text()
            # Broadcast received data to all other connected clients
            for conn in list(connections):
                if conn is not ws:
                    await conn.send_text(data)
    except WebSocketDisconnect:
        if ws in connections:
            connections.remove(ws)
