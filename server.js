require('dotenv').config();
const express = require('express');
const path = require('path');
const fs = require('fs');
const WebSocket = require('ws');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY || '');

const DB_PATH = path.join(__dirname, 'db.json');
const tokenPackages = require('./tokenPackages.json');

function readDB() {
  return JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
}

function writeDB(data) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

function addPurchase(purchase) {
  const db = readDB();
  db.purchases.push(purchase);
  writeDB(db);
}

function updateUserBalance(userId, tokens) {
  const db = readDB();
  const user = db.users.find(u => u.id === userId);
  if (user) {
    user.balance = (user.balance || 0) + tokens;
    writeDB(db);
  }
}

const port = process.env.PORT || 8080;
const app = express();
app.use(helmet());

// Stripe webhook must be processed before body parsing
app.post('/webhook', express.raw({ type: 'application/json' }), (req, res) => {
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
    addPurchase({
      id: Date.now(),
      userId,
      tokens,
      sessionId: session.id,
      created: new Date().toISOString(),
    });
    updateUserBalance(userId, tokens);
  }
  res.json({ received: true });
});

app.use(express.json());

const limiter = rateLimit({ windowMs: 60 * 1000, max: 100 });
app.use(limiter);

app.get('/health', (req, res) => {
  res.send('ok');
});

app.post('/checkout-session', async (req, res) => {
  const { packageId, userId } = req.body;
  const pack = tokenPackages.find(p => p.id === Number(packageId));
  if (!pack) {
    return res.status(400).json({ error: 'Invalid package' });
  }

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: 'usd',
            unit_amount: Math.round(pack.price * 100),
            product_data: { name: `${pack.webTokens} Vibecoins` },
          },
          quantity: 1,
        },
      ],
      metadata: {
        userId,
        tokens: pack.webTokens,
      },
      success_url: `${req.protocol}://${req.get('host')}/success.html`,
      cancel_url: `${req.protocol}://${req.get('host')}/cancel.html`,
    });
    res.json({ url: session.url });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not create session' });
  }
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
