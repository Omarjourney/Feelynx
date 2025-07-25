require('dotenv').config();
const express = require('express');
const path = require('path');
const WebSocket = require('ws');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const Sentry = require('@sentry/node');

Sentry.init({
  dsn: process.env.SENTRY_DSN || '',
});

const port = process.env.PORT || 8080;
const app = express();
app.use(helmet());

app.use(Sentry.Handlers.requestHandler());

const limiter = rateLimit({ windowMs: 60 * 1000, max: 100 });
app.use(limiter);

app.get('/health', (req, res) => {
  res.send('ok');
});

app.get('/env.js', (req, res) => {
  res.type('application/javascript');
  res.send(`window.SENTRY_DSN_FRONTEND="${process.env.SENTRY_DSN_FRONTEND || ''}";\nwindow.GA_MEASUREMENT_ID="${process.env.GA_MEASUREMENT_ID || ''}";`);
});

// Serve static files from the project root so index.html works out of the box
app.use(express.static(path.join(__dirname)));

app.use(Sentry.Handlers.errorHandler());

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

