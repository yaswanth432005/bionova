// Import the Prisma Client class from the generated library
import { PrismaClient } from "@prisma/client"

// Define a type for the global object to store the Prisma instance
// This prevents multiple instances from being created during hot-reloading in development
const globalForPrisma = global as unknown as { prisma: PrismaClient }

// Export a prisma instance: reuse the existing one from global, or create a new one
export const prisma = globalForPrisma.prisma || new PrismaClient()

// In development mode, attach the prisma instance to the global object
// so it persists across hot-reloads, saving database connection limits
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma
