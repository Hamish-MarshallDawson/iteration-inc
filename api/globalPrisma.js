// Import the PrismaClient class from the Prisma library
import { PrismaClient } from "@prisma/client";

// Ensure Prisma Client is reused in serverless environments
// Use a global variable to store the Prisma client instance
// This prevents creating multiple instances in a serverless environment like we did on vercel
const globalForPrisma = globalThis;

// If a Prisma client instance already exists (from previous function calls), reuse it
// Otherwise, create a new Prisma client instance
globalForPrisma.prisma = globalForPrisma.prisma || new PrismaClient();

// Export the Prisma client instance for use in API routes (serverless functions in api folder) and database queries
export const prisma = globalForPrisma.prisma;
