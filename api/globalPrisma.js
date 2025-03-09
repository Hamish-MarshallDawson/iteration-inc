import { PrismaClient } from "@prisma/client";

// Ensure Prisma Client is reused in serverless environments
const globalForPrisma = globalThis;
globalForPrisma.prisma = globalForPrisma.prisma || new PrismaClient();
export const prisma = globalForPrisma.prisma;
