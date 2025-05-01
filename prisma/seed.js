const { PrismaClient } = require('../src/generated/prisma');
const { hash } = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  // Create test users
  const adminPassword = await hash('admin123', 12);
  const providerPassword = await hash('provider123', 12);
  const staffPassword = await hash('staff123', 12);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      name: 'Admin User',
      password: adminPassword,
      role: 'ADMIN',
    },
  });

  const provider = await prisma.user.upsert({
    where: { email: 'provider@example.com' },
    update: {},
    create: {
      email: 'provider@example.com',
      name: 'Provider User',
      password: providerPassword,
      role: 'PROVIDER',
    },
  });

  const staff = await prisma.user.upsert({
    where: { email: 'staff@example.com' },
    update: {},
    create: {
      email: 'staff@example.com',
      name: 'Staff User',
      password: staffPassword,
      role: 'STAFF',
    },
  });

  // Create test provider
  const testProvider = await prisma.provider.upsert({
    where: { email: 'testprovider@example.com' },
    update: {},
    create: {
      name: 'Test Medical Center',
      streetAddress: '123 Medical St',
      zipCode: '12345',
      city: 'Medical City',
      state: 'CA',
      attentionInfo: 'Attention: Medical Records',
      email: 'testprovider@example.com',
      phone: '555-0123',
      fax: '555-0124',
      hipaaRequired: true,
      hipaaSamplePath: '/samples/hipaa.pdf',
      brFaxNumber: '555-0125',
      mrFaxNumber: '555-0126',
      brEmailId: 'br@testprovider.com',
      mrEmailId: 'mr@testprovider.com',
      mrPortalLink: 'https://portal.testprovider.com/mr',
      mrPortalProviderId: 'TP123',
      brPortalLink: 'https://portal.testprovider.com/br',
      brPortalProviderId: 'TP456',
      brMailingAddress: 'PO Box 123, Medical City, CA 12345',
      mrMailingAddress: 'PO Box 456, Medical City, CA 12345',
    },
  });

  // Create test patients
  const patient1 = await prisma.patient.upsert({
    where: {
      email: 'john.doe@example.com',
    },
    update: {},
    create: {
      firstName: 'John',
      lastName: 'Doe',
      dateOfBirth: new Date('1980-01-01'),
      email: 'john.doe@example.com',
      phone: '555-0001',
      address: '123 Main St, Medical City, CA 12345',
    },
  });

  const patient2 = await prisma.patient.upsert({
    where: {
      email: 'jane.smith@example.com',
    },
    update: {},
    create: {
      firstName: 'Jane',
      lastName: 'Smith',
      dateOfBirth: new Date('1990-05-15'),
      email: 'jane.smith@example.com',
      phone: '555-0002',
      address: '456 Oak St, Medical City, CA 12345',
    },
  });

  // Create patient-provider relationships
  await prisma.patientProvider.upsert({
    where: {
      patientId_providerId: {
        patientId: patient1.id,
        providerId: testProvider.id,
      },
    },
    update: {},
    create: {
      patientId: patient1.id,
      providerId: testProvider.id,
      requestType: 'BR_MR_WITH_AFFIDAVIT',
      dosType: 'DOI_TO_PRESENT',
      dosStart: new Date('2024-01-01'),
    },
  });

  await prisma.patientProvider.upsert({
    where: {
      patientId_providerId: {
        patientId: patient2.id,
        providerId: testProvider.id,
      },
    },
    update: {},
    create: {
      patientId: patient2.id,
      providerId: testProvider.id,
      requestType: 'BR_WITH_AFFIDAVIT',
      dosType: 'CUSTOM',
      dosStart: new Date('2024-02-15'),
      dosEnd: new Date('2024-03-15'),
    },
  });

  // Create affidavit templates
  const template1 = await prisma.affidavitTemplate.upsert({
    where: { name: 'Standard Medical Records Affidavit' },
    update: {},
    create: {
      name: 'Standard Medical Records Affidavit',
      filePath: '/templates/standard-medical-records.pdf',
      structure: {
        sections: [
          {
            title: 'Patient Information',
            fields: ['name', 'dob', 'doi'],
          },
          {
            title: 'Provider Information',
            fields: ['name', 'address', 'phone'],
          },
          {
            title: 'Records Request',
            fields: ['dateRange', 'recordTypes'],
          },
        ],
      },
      version: 1,
    },
  });

  // Create test affidavits
  const affidavit1 = await prisma.affidavit.upsert({
    where: {
      id: 'test-affidavit-1',
    },
    update: {},
    create: {
      id: 'test-affidavit-1',
      patientId: patient1.id,
      providerId: testProvider.id,
      content: JSON.stringify({
        firstName: 'John',
        lastName: 'Doe',
        dateOfBirth: '1980-01-01',
        providerName: 'Test Medical Center',
        dateRange: '2024-01-01 to present',
        recordTypes: ['Medical Records', 'Billing Records'],
      }),
      status: 'DRAFT',
    },
  });

  const affidavit2 = await prisma.affidavit.upsert({
    where: {
      id: 'test-affidavit-2',
    },
    update: {},
    create: {
      id: 'test-affidavit-2',
      patientId: patient2.id,
      providerId: testProvider.id,
      content: JSON.stringify({
        firstName: 'Jane',
        lastName: 'Smith',
        dateOfBirth: '1990-05-15',
        providerName: 'Test Medical Center',
        dateRange: '2024-02-15 to 2024-03-15',
        recordTypes: ['Medical Records'],
      }),
      status: 'PENDING_REVIEW',
    },
  });

  console.log('Seed data created successfully!');
  console.log({
    users: { admin, provider, staff },
    provider: testProvider,
    patients: { patient1, patient2 },
    templates: { template1 },
    affidavits: { affidavit1, affidavit2 },
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 