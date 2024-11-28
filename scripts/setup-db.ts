import { setupDatabase } from '../src/utils/setupDatabase';

async function main() {
  try {
    await setupDatabase();
    console.log('Database setup completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Failed to set up database:', error);
    process.exit(1);
  }
}

main();