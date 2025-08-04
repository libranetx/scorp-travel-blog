import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const travelType = searchParams.get('travelType');

    const whereClause = travelType ? {
      travelType: travelType
    } : {};

    const posts = await prisma.post.findMany({
      where: whereClause,
      orderBy: {
        createdAt: 'desc' // Sort by createdAt in descending order (newest first)
      }
    });
    return NextResponse.json(posts);
  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch posts', details: process.env.NODE_ENV === 'development' ? error : undefined },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check admin authentication
    const authResult = await requireAdmin();
    if (authResult instanceof NextResponse) {
      return authResult;
    }
    
    const body = await request.json();
    
    if (!body.title || !body.content) {
      return NextResponse.json(
        { error: "Title and content are required" },
        { status: 400 }
      );
    }

    const post = await prisma.post.create({
      data: {
        title: body.title,
        content: body.content,
        travelType: body.travelType || null,
        imageUrl: body.imageUrl,
        imagePublicId: body.imagePublicId,
      },
    });
    
    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    console.error('Error creating post:', error);
    return NextResponse.json(
      { error: 'Failed to create post', details: process.env.NODE_ENV === 'development' ? error : undefined },
      { status: 500 }
    );
  }
}