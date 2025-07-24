const express = require('express');
const path = require('path');
const WebSocket = require('ws');

const port = process.env.PORT || 8080;
const app = express();

// Serve static files from the project root so index.html works out of the box
app.use(express.static(path.join(__dirname)));

const server = app.listen(port, () => {
  console.log(`HTTP server running on http://localhost:${port}`);
});

const wss = new WebSocket.Server({ server });

wss.on('connection', ws => {
  ws.on('message', message => {
    // Broadcast message to all other clients
    wss.clients.forEach(client => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(message.toString());
      }
    });
  });
});

console.log(`WebSocket signaling server running on ws://localhost:${port}`);
