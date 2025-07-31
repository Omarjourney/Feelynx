require('dotenv').config();
const express = require('express');
const path = require('path');
const WebSocket = require('ws');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const port = process.env.PORT || 8080;
const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

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
app.use(express.json());

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

async function uploadToS3(file, folder) {
  const key = `${folder}/${crypto.randomUUID()}-${file.originalname}`;
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

app.get('/health', (req, res) => {
  res.send('ok');
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
