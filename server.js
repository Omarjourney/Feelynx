require('dotenv').config();
const express = require('express');
const path = require('path');
const WebSocket = require('ws');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { AccessToken } = require('livekit-server-sdk');

const port = process.env.PORT || 8080;
const app = express();
app.use(helmet());

const limiter = rateLimit({ windowMs: 60 * 1000, max: 100 });
app.use(limiter);

app.get('/health', (req, res) => {
  res.send('ok');
});

app.get('/livekit-token', (req, res) => {
  const identity = req.query.identity || 'anonymous';
  const room = req.query.room || 'feelynx';
  const at = new AccessToken(
    process.env.LIVEKIT_API_KEY,
    process.env.LIVEKIT_API_SECRET,
    { identity }
  );
  at.addGrant({ room, roomJoin: true });
  res.json({ token: at.toJwt() });
});

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
