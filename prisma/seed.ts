import { Prisma, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.user.deleteMany();

  const users: Prisma.UserCreateInput[] = [
    {
      email: 'test01@test.com',
      name: 'testuser01',
    },
    {
      email: 'test02@test.com',
      name: 'testuser02',
    },
    {
      email: 'test03@test.com',
      name: 'testuser03',
    },
  ];

  for (const user of users) {
    await prisma.user.create({
      data: user,
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (err) => {
    console.error(err);
    await prisma.$disconnect();
    process.exit(1);
  })
