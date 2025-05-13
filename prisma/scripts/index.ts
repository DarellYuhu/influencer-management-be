import { PrismaClient } from 'generated/prisma';

const prisma = new PrismaClient();

async function main() {
  const duplicates = await prisma.account.groupBy({
    by: ['username'],
    _count: { username: true },
    having: {
      username: {
        _count: {
          gt: 1,
        },
      },
    },
  });
  await prisma.account.deleteMany({
    where: {
      username: {
        in: duplicates.map((item) => item.username),
      },
    },
  });
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
