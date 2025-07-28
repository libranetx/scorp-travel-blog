// app/api/posts/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const travelType = searchParams.get('travelType')
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined

    const posts = await prisma.post.findMany({
      where: travelType ? { travelType } : undefined,
      orderBy: {
        createdAt: 'desc' // Sort by createdAt in descending order (newest first)
      },
      take: limit, // Optional limit parameter
      select: {
        id: true,
        title: true,
        content: true,
        createdAt: true,
        travelType: true,
        imageUrl: true
        // Don't include sensitive fields like authorId unless needed
      }
    })

    return NextResponse.json(posts)
  } catch (error) {
    console.error('Error fetching posts:', error)
    return NextResponse.json(
      { error: 'Failed to fetch posts' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate required fields
    if (!body.title || !body.content) {
      return NextResponse.json(
        { error: "Title and content are required" },
        { status: 400 }
      )
    }

    // Validate travelType if provided
    const validTravelTypes = [
      'Adventure',
      'Cultural',
      'Family',
      'Honeymoon',
      'Solo',
      'Group',
      'Luxury',
      'Business'
    ]
    
    if (body.travelType && !validTravelTypes.includes(body.travelType)) {
      return NextResponse.json(
        { error: "Invalid travel type" },
        { status: 400 }
      )
    }

    // Validate imageUrl format if provided
    if (body.imageUrl && !isValidUrl(body.imageUrl)) {
      return NextResponse.json(
        { error: "Invalid image URL format" },
        { status: 400 }
      )
    }

    const post = await prisma.post.create({
      data: {
        title: body.title,
        content: body.content,
        travelType: body.travelType || null,
        imageUrl: body.imageUrl || null,
        // Add any additional fields like authorId if you have authentication
        // authorId: body.userId
      },
      select: {
        id: true,
        title: true,
        createdAt: true,
        travelType: true
        // Don't return sensitive data in response
      }
    })
    
    return NextResponse.json(post, { status: 201 })
  } catch (error) {
    console.error('Error creating post:', error)
    return NextResponse.json(
      { error: 'Failed to create post' },
      { status: 500 }
    )
  }
}

// Helper function to validate URLs
function isValidUrl(url: string): boolean {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}