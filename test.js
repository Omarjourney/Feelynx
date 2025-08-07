require('dotenv').config();
process.env.JWT_SECRET = process.env.JWT_SECRET || 'test_secret';
process.env.STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || 'sk_test';
// Use a lightweight stub of the Prisma client so tests do not require
// the full Prisma engine or a database connection.
const { PrismaClient } = require('./prisma_client_stub');
const { updateUserBalance, sendGift, readDB, server, wss } = require('./server');
const fs = require('fs');
const path = require('path');
const DB_PATH = path.join(__dirname, 'db.json');

async function resetDB() {
  const defaultData = {
    users: [{ id: 1, name: 'Stub User', balance: 0 }],
    purchases: [],
    gifts: [
      { id: 1, name: 'Rose', cost: 10 },
      { id: 2, name: 'Diamond', cost: 100 },
    ],
    giftTransactions: [],
  };
  await fs.promises.writeFile(DB_PATH, JSON.stringify(defaultData, null, 2));
}

async function main() {
  await resetDB();
  const prisma = new PrismaClient();
  const users = await prisma.user.findMany();
  console.log('Users:', users);

  await updateUserBalance(1, 20);
  await sendGift(1, 1, 1);
  const db = await readDB();
  console.log('Balance after gift:', db.users[0].balance);
  console.log('Gift transactions:', db.giftTransactions.length);

  await prisma.$disconnect();
  server.close();
  wss.close();
}

main().catch((e) => console.error(e));
