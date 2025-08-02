require('dotenv').config();
// Use a lightweight stub of the Prisma client so tests do not require
// the full Prisma engine or a database connection.
const { PrismaClient } = require('./prisma_client_stub');

async function main() {
  const prisma = new PrismaClient();
  const users = await prisma.user.findMany();
  console.log('Users:', users);
  await prisma.$disconnect();
}

main().catch((e) => console.error(e));
