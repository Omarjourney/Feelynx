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

// Allow frontend applications to communicate with this API
// CLIENT_ORIGIN may be a comma separated list of allowed origins
const allowedOrigins = (process.env.CLIENT_ORIGIN || '')
  .split(',')
  .map(o => o.trim())
  .filter(Boolean);
app.use(
  cors({
    origin: allowedOrigins.length ? allowedOrigins : true,
    credentials: true,
  })
);

const DB_PATH = path.join(__dirname, 'db.json');

async function readDB() {
  try {
    const data = await fs.promises.readFile(DB_PATH, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    if (err.code === 'ENOENT' || err instanceof SyntaxError) {
      const defaultData = {
        users: [],
        purchases: [],
        gifts: [
          { id: 1, name: 'Rose', cost: 10 },
          { id: 2, name: 'Diamond', cost: 100 },
        ],
        giftTransactions: [],
      };
      await writeDB(defaultData);
      return defaultData;
    }
    throw err;
  }
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

async function sendGift(fromUserId, toUserId, giftId) {
  const db = await readDB();
  const gift = db.gifts.find(g => g.id === giftId);
  const fromUser = db.users.find(u => u.id === fromUserId);
  const toUser = db.users.find(u => u.id === toUserId);
  if (!gift || !fromUser || !toUser) {
    throw new Error('Invalid gift or user');
  }
  if ((fromUser.balance || 0) < gift.cost) {
    throw new Error('Insufficient balance');
  }
  fromUser.balance -= gift.cost;
  db.giftTransactions.push({
    id: Date.now(),
    fromUserId,
    toUserId,
    giftId,
    cost: gift.cost,
    created: new Date().toISOString(),
  });
  await writeDB(db);
  return { balance: fromUser.balance };
}

async function getLeaderboard() {
  const db = await readDB();
  const totals = {};
  for (const tx of db.giftTransactions) {
    totals[tx.fromUserId] = (totals[tx.fromUserId] || 0) + tx.cost;
  }
  return Object.entries(totals)
    .map(([userId, total]) => ({ userId: Number(userId), total }))
    .sort((a, b) => b.total - a.total);
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

app.post('/gifts/send', authenticate, async (req, res) => {
  const { toUserId, giftId } = req.body;
  const fromUserId = req.user.id;
  try {
    const result = await sendGift(fromUserId, toUserId, giftId);
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.get('/leaderboard', async (_req, res) => {
  const leaderboard = await getLeaderboard();
  res.json({ leaderboard });
});

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
  if (
    !folder ||
    folder.startsWith('/') ||
    folder.endsWith('/') ||
    folder.includes('..') ||
    !/^[A-Za-z0-9/_-]+$/.test(folder)
  ) {
    throw new Error('Invalid folder name');
  }

  const ext = path.extname(file.originalname);
  const key = `${folder}/${crypto.randomUUID()}${ext}`;

  await s3.send(
    new PutObjectCommand({
      Bucket: process.env.S3_BUCKET,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
    })
  );

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

// Authenticate standard users via JWT. The token is expected in the
// Authorization header as `Bearer <token>`.
function authenticate(req, res, next) {
  const authHeader = req.headers['authorization'] || '';
  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  try {
    const payload = jwt.verify(token, jwtSecret);
    req.user = payload;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
}

// Determine the frontend directory. Prefer the built assets in "dist" if they
// exist; otherwise fall back to the raw files in "public" so the server can
// still serve something meaningful in development or when a build hasn't run
// yet. This prevents 404 errors on the root path when the dist folder is
// missing.
const distDir = path.join(__dirname, 'dist');
const publicDir = path.join(__dirname, 'public');
const frontendDir = fs.existsSync(distDir) ? distDir : publicDir;

// Serve the frontend assets from the chosen directory.
app.use(express.static(frontendDir));

// Dedicated health-check endpoint so "/" always serves the app.
app.get('/health', (_req, res) => {
  res.send('ok');
});

// Generate a LiveKit access token for the authenticated user.
// POST or GET /livekit/token { room: string, role: 'creator' | 'fan' }
function handleLivekitToken(req, res) {
  const { room, role } = req.method === 'POST' ? req.body : req.query;
  if (!room || !role) {
    return res.status(400).json({ error: 'room and role are required' });
  }

  const identity = String(req.user.id || req.user.sub || req.user.email);
  const at = new AccessToken(LIVEKIT_API_KEY, LIVEKIT_API_SECRET, {
    identity,
    ttl: 60 * 60, // 1 hour
  });
  at.addGrant({
    room,
    roomJoin: true,
    canPublish: role === 'creator',
    canSubscribe: true,
  });
  res.json({ token: at.toJwt() });
}
app.post('/livekit/token', ensureLiveKitEnv, authenticate, handleLivekitToken);
app.get('/livekit/token', ensureLiveKitEnv, authenticate, handleLivekitToken);

// Create a new LiveKit room
// POST or GET /livekit/create-room { name: string }
async function handleCreateRoom(req, res) {
  try {
    const { name } = req.method === 'POST' ? req.body : req.query;
    if (!name) {
      return res.status(400).json({ error: 'name is required' });
    }
    const room = await roomService.createRoom({ name });
    res.json(room);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
app.post('/livekit/create-room', ensureLiveKitEnv, authenticate, handleCreateRoom);
app.get('/livekit/create-room', ensureLiveKitEnv, authenticate, handleCreateRoom);

// Join an existing room. If it doesn't exist it will be created.
// POST or GET /livekit/join-room { room: string, role: 'creator' | 'fan' }
async function handleJoinRoom(req, res) {
  const { room, role } = req.method === 'POST' ? req.body : req.query;
  if (!room || !role) {
    return res.status(400).json({ error: 'room and role are required' });
  }
  try {
    try {
      await roomService.createRoom({ name: room });
    } catch (err) {
      // ignore if room already exists
    }

    const identity = String(req.user.id || req.user.sub || req.user.email);
    const at = new AccessToken(LIVEKIT_API_KEY, LIVEKIT_API_SECRET, {
      identity,
      ttl: 60 * 60,
    });
    at.addGrant({
      room,
      roomJoin: true,
      canPublish: role === 'creator',
      canSubscribe: true,
    });

    res.json({ token: at.toJwt() });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
app.post('/livekit/join-room', ensureLiveKitEnv, authenticate, handleJoinRoom);
app.get('/livekit/join-room', ensureLiveKitEnv, authenticate, handleJoinRoom);

// Return 404 for any other routes.
app.use((_req, res) => {
  res.status(404).send('Not Found');
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
  readDB,
  sendGift,
  getLeaderboard,
  server,
  wss,
};
