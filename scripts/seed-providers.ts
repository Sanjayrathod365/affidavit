import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  try {
    // Create a test provider
    const provider = await prisma.provider.create({
      data: {
        name: 'Test Provider',
        address: '123 Test St, Test City, TS 12345',
        email: 'test@provider.com',
        phone: '(123) 456-7890'
      }
    });
    
    console.log('Created test provider:', provider);
  } catch (error) {
    console.error('Error seeding providers:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main(); 