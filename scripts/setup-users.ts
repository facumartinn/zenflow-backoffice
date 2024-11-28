import { createAdminUsers } from '../src/services/auth';

async function main() {
  try {
    console.log('Creating admin users...');
    await createAdminUsers();
    console.log('Admin users created successfully');
    process.exit(0);
  } catch (error) {
    console.error('Failed to create admin users:', error);
    process.exit(1);
  }
}

main();