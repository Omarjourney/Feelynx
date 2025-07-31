require('dotenv').config();
const { execSync } = require('child_process');
const { PrismaClient } = require('@prisma/client');

async function runMigrations() {
  execSync('npx prisma migrate deploy', { stdio: 'inherit' });
}

async function main() {
  await runMigrations();
  const prisma = new PrismaClient();
  const users = await prisma.user.findMany();
  console.log('Users:', users);
  await prisma.$disconnect();
}

main().catch((e) => console.error(e));
