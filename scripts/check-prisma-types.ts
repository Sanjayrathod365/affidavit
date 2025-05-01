import { PrismaClient } from '@prisma/client';

// This will log the available types
console.log('Prisma Client:', PrismaClient);

// Create a client instance
const prisma = new PrismaClient();

// This will log the available models
console.log('Available models:', Object.keys(prisma));

// Disconnect from the database
prisma.$disconnect(); 