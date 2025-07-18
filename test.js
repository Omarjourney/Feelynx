let PrismaClient;
try {
  ({ PrismaClient } = require('@prisma/client'));
} catch (e) {
  ({ PrismaClient } = require('./prisma_client_stub'));
}
const prisma = new PrismaClient();

async function main() {
  // Simple test: count users
  const users = await prisma.user.findMany();
  console.log('Users:', users);
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
