require('dotenv').config();
const express = require('express');
const path = require('path');
const fs = require('fs');
const WebSocket = require('ws');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cors = require('cors');
const Stripe = require('stripe');
const multer = require('multer');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const { AccessToken, RoomServiceClient } = require('livekit-server-sdk');

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '');

const jwtSecret = process.env.JWT_SECRET;
if (!jwtSecret) {
  console.error('JWT_SECRET environment variable is required');
  process.exit(1);
}

const port = process.env.PORT || 8080;
const app = express();
app.use(helmet());
app.use(cors());

const DB_PATH = path.join(__dirname, 'db.json');

async function readDB() {
  const data = await fs.promises.readFile(DB_PATH, 'utf8');
  return JSON.parse(data);
}

async function writeDB(data) {
  await fs.promises.writeFile(DB_PATH, JSON.stringify(data, null, 2));
}

async function addPurchase(purchase) {
  const db = await readDB();
  db.purchases.push(purchase);
  await writeDB(db);
}

async function updateUserBalance(userId, tokens) {
  const db = await readDB();
  const user = db.users.find(u => u.id === userId);
  if (user) {
    user.balance = (user.balance || 0) + tokens;
    await writeDB(db);
  }
}

// Stripe webhook must be processed before body parsing
app.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET || ''
    );
  } catch (err) {
    console.error('Webhook signature verification failed.', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const userId = parseInt(session.metadata.userId, 10);
    const tokens = parseInt(session.metadata.tokens, 10);
    await addPurchase({
      id: Date.now(),
      userId,
      tokens,
      sessionId: session.id,
      created: new Date().toISOString(),
    });
    await updateUserBalance(userId, tokens);
  }
  res.json({ received: true });
});

app.use(express.json());

const limiter = rateLimit({ windowMs: 60 * 1000, max: 100 });
app.use(limiter);

const upload = multer({ storage: multer.memoryStorage() });

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: process.env.AWS_ACCESS_KEY_ID
    ? {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      }
    : undefined,
});

const LIVEKIT_HOST = process.env.LIVEKIT_HOST;
const LIVEKIT_API_KEY = process.env.LIVEKIT_API_KEY;
const LIVEKIT_API_SECRET = process.env.LIVEKIT_API_SECRET;
let roomService;

function ensureLiveKitEnv(req, res, next) {
  if (!LIVEKIT_HOST || !LIVEKIT_API_KEY || !LIVEKIT_API_SECRET) {
    return res
      .status(503)
      .json({ error: 'LiveKit environment variables are not configured' });
  }
  if (!roomService) {
    roomService = new RoomServiceClient(
      LIVEKIT_HOST,
      LIVEKIT_API_KEY,
      LIVEKIT_API_SECRET
    );
  }
  next();
}

async function uploadToS3(file, folder) {
  const base = process.env.MEDIA_BASE_URL || '';
  return `${base}${key}`;
}

function requireAdmin(req, res, next) {
  const authHeader = req.headers['authorization'] || '';
  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  try {
    const payload = jwt.verify(token, jwtSecret);
    if (payload.role !== 'admin') {
      return res.status(403).json({ error: 'Forbidden' });
    }
    req.user = payload;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
}

app.use(express.static(path.join(__dirname, 'public')));
app.get('/', (_, res) =>
  res.sendFile(path.join(__dirname, 'public', 'index.html'))
);

app.get('/health', (req, res) => {
  res.send('ok');
});

app.get('/livekit-token', ensureLiveKitEnv, (req, res) => {
  const { identity, room } = req.query;
  if (!identity) {
    return res.status(400).json({ error: 'identity is required' });
  }
  const at = new AccessToken(LIVEKIT_API_KEY, LIVEKIT_API_SECRET, {
    identity,
  });
  at.addGrant({ roomJoin: true, room });
  const token = at.toJwt();
  res.json({ token });
});

app.post('/rooms', ensureLiveKitEnv, async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ error: 'name is required' });
    }
    const room = await roomService.createRoom({ name });
    res.json(room);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/rooms', ensureLiveKitEnv, async (req, res) => {
  try {
    const rooms = await roomService.listRooms();
    res.json(rooms);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/rooms/:name', ensureLiveKitEnv, async (req, res) => {
  try {
    await roomService.deleteRoom(req.params.name);
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
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

module.exports = {
  addPurchase,
  updateUserBalance,
  uploadToS3,
  requireAdmin,
};
