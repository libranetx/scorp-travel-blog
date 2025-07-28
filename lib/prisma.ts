
//Singleton Prisma client instance to prevent multiple connections
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
//This code is setting up a singleton instance of the 
// Prisma Client to prevent multiple database connections during development


//mean only one prisma instance is needed to connect to database
//This is particularly useful in development environments where
// the server may restart frequently, as it prevents the creation of multiple Prisma Client instances that can lead to connection issues. 
//In production, a new instance is created each time, which is the standard behavior.
//This ensures that the Prisma Client is only instantiated once,
//avoiding potential issues with multiple connections to the database during development.  


