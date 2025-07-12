const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Simple test: count users
  const users = await prisma.user.findMany();
  console.log('Users:', users);
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
