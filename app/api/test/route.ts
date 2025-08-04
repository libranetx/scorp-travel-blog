import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // Check environment variables
    const envCheck = {
      DATABASE_URL: process.env.DATABASE_URL ? 'Set' : 'Missing',
      NEXTAUTH_URL: process.env.NEXTAUTH_URL ? 'Set' : 'Missing',
      NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ? 'Set' : 'Missing',
      NODE_ENV: process.env.NODE_ENV,
    };

    // Test database connection
    let dbStatus = 'Unknown';
    try {
      await prisma.$connect();
      dbStatus = 'Connected';
      await prisma.$disconnect();
    } catch (dbError) {
      dbStatus = `Error: ${dbError}`;
    }

    return NextResponse.json({
      status: 'OK',
      environment: envCheck,
      database: dbStatus,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return NextResponse.json({
      status: 'Error',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
} 