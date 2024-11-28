import { PrismaClient, Role } from '@prisma/client';
import { hash } from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Create admin user
  const adminPassword = await hash('admin123', 10);
  await prisma.user.upsert({
    where: { email: 'admin@test.com' },
    update: {},
    create: {
      email: 'admin@test.com',
      password: adminPassword,
      role: Role.ADMIN,
    },
  });

  // Create regular user
  const userPassword = await hash('user123', 10);
  await prisma.user.upsert({
    where: { email: 'user@test.com' },
    update: {},
    create: {
      email: 'user@test.com',
      password: userPassword,
      role: Role.USER,
    },
  });

  console.log('Seed completed! Test users created:');
  console.log('Admin - Email: admin@test.com, Password: admin123');
  console.log('User - Email: user@test.com, Password: user123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });