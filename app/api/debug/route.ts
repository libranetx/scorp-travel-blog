import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // Test database connection
    await prisma.$connect();
    
    // Try to get a post
    const posts = await prisma.post.findMany({
      take: 1
    });
    
    await prisma.$disconnect();
    
    return NextResponse.json({
      status: 'OK',
      database: 'Connected',
      postsCount: posts.length,
      samplePost: posts[0] || null,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Debug error:', error);
    return NextResponse.json({
      status: 'Error',
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: process.env.NODE_ENV === 'development' ? error instanceof Error ? error.stack : undefined : undefined,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
} 