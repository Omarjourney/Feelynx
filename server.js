require('dotenv').config();
const express = require('express');
const path = require('path');
const WebSocket = require('ws');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { AccessToken } = require('livekit-server-sdk');
const cors = require('cors');

const livekitHost = process.env.LIVEKIT_HOST || 'http://localhost:7880';
const livekitApiKey = process.env.LIVEKIT_API_KEY || '';
const livekitApiSecret = process.env.LIVEKIT_API_SECRET || '';

const port = process.env.PORT || 8080;
const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json());

// Mock list of creators. Replace with a database in production.
let creators = [
  {
    id: 1,
    username: 'alpha',
    displayName: 'Alpha One',
    avatar: 'https://placekitten.com/200/200',
    country: 'US',
    specialty: 'gaming',
    isLive: true,
    followers: 1000,
    trendingScore: 50,
    createdAt: new Date().toISOString(),
    lastOnline: new Date().toISOString(),
  },
  {
    id: 2,
    username: 'beta',
    displayName: 'Beta Two',
    avatar: 'https://placekitten.com/201/200',
    country: 'CA',
    specialty: 'music',
    isLive: false,
    followers: 500,
    trendingScore: 20,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    lastOnline: new Date(Date.now() - 3600000).toISOString(),
  },
];

const limiter = rateLimit({ windowMs: 60 * 1000, max: 100 });
app.use(limiter);

app.get('/health', (req, res) => {
  res.send('ok');
});

/**
 * GET /api/creators
 * Returns list of creators with optional filtering and sorting.
 */
app.get('/api/creators', (req, res) => {
  let result = [...creators];
  const { country, specialty, isLive, search, sort } = req.query;

  if (country) {
    result = result.filter(c => c.country === country);
  }
  if (specialty) {
    result = result.filter(c => c.specialty === specialty);
  }
  if (typeof isLive !== 'undefined') {
    const live = isLive === 'true';
    result = result.filter(c => c.isLive === live);
  }
  if (search) {
    const q = search.toString().toLowerCase();
    result = result.filter(
      c =>
        c.username.toLowerCase().includes(q) ||
        c.displayName.toLowerCase().includes(q)
    );
  }
  if (sort) {
    if (sort === 'trendingScore') {
      result.sort((a, b) => b.trendingScore - a.trendingScore);
    } else if (sort === 'createdAt') {
      result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (sort === 'followers') {
      result.sort((a, b) => b.followers - a.followers);
    }
  }

  res.json(result);
});

/**
 * POST /api/creators
 * Adds a demo creator to the in-memory list.
 */
app.post('/api/creators', (req, res) => {
  const data = req.body || {};
  const id = creators.length ? creators[creators.length - 1].id + 1 : 1;
  const newCreator = {
    id,
    username: data.username || `user${id}`,
    displayName: data.displayName || `User ${id}`,
    avatar: data.avatar || 'https://placekitten.com/200/200',
    country: data.country || 'US',
    specialty: data.specialty || 'general',
    isLive: Boolean(data.isLive),
    followers: data.followers || 0,
    trendingScore: data.trendingScore || 0,
    createdAt: data.createdAt || new Date().toISOString(),
    lastOnline: data.lastOnline || new Date().toISOString(),
  };
  creators.push(newCreator);
  res.status(201).json(newCreator);
});

// Serve static files from the project root so index.html works out of the box
app.use(express.static(path.join(__dirname)));

app.get('/livekit-token', (req, res) => {
  const identity = req.query.identity || 'user';
  const room = req.query.room || 'feelynx';
  if (!livekitApiKey || !livekitApiSecret) {
    return res.status(500).send('LiveKit credentials not configured');
  }
  const at = new AccessToken(livekitApiKey, livekitApiSecret, { identity, ttl: 3600 });
  at.addGrant({ roomJoin: true, room });
  res.json({ token: at.toJwt(), url: livekitHost });
});

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
  // Example: notify clients about status changes
  ws.send(JSON.stringify({ type: 'welcome', connectedClients: wss.clients.size }));
});

console.log(`WebSocket signaling server running on ws://localhost:${port}`);

// In a real deployment review authentication, rate limiting and database
// operations closely. Payments, messaging and group room functionality would
// extend these endpoints with proper access controls.
