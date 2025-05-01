const { PrismaClient } = require('./node_modules/.prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    console.log('Testing database connection...');
    
    // Test User table
    console.log('Testing User table...');
    const users = await prisma.user.findMany();
    console.log(`Found ${users.length} users`);
    
    // Test Patient table
    console.log('Testing Patient table...');
    const patients = await prisma.patient.findMany();
    console.log(`Found ${patients.length} patients`);
    
    // Test Provider table
    console.log('Testing Provider table...');
    const providers = await prisma.provider.findMany();
    console.log(`Found ${providers.length} providers`);
    
    // Test Affidavit table
    console.log('Testing Affidavit table...');
    const affidavits = await prisma.affidavit.findMany();
    console.log(`Found ${affidavits.length} affidavits`);
    
    // Test AffidavitTemplate table
    console.log('Testing AffidavitTemplate table...');
    const templates = await prisma.affidavitTemplate.findMany();
    console.log(`Found ${templates.length} templates`);
    
    console.log('All database tables are accessible!');
  } catch (error) {
    console.error('Error accessing database:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main(); 