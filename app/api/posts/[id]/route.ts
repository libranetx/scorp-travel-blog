import { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET single post
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Validate ID is a number
    if (isNaN(parseInt(params.id))) {
      return NextResponse.json(
        { error: "Invalid post ID format" },
        { status: 400 }
      )
    }

    const post = await prisma.post.findUnique({
      where: { id: parseInt(params.id) }
    })

    if (!post) {
      return NextResponse.json(
        { error: "Post not found" },
        { status: 404 }
      )
    }

    return NextResponse.json(post)
  } catch (error) {
    console.error('Error fetching post:', error)
    return NextResponse.json(
      { error: "Failed to fetch post" },
      { status: 500 }
    )
  }
}

// UPDATE post
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Validate ID is a number
    if (isNaN(parseInt(params.id))) {
      return NextResponse.json(
        { error: "Invalid post ID format" },
        { status: 400 }
      )
    }

    const body = await request.json()

    if (!body.title || !body.content) {
      return NextResponse.json(
        { error: "Title and content are required" },
        { status: 400 }
      )
    }

    // Check if post exists
    const existingPost = await prisma.post.findUnique({
      where: { id: parseInt(params.id) }
    })

    if (!existingPost) {
      return NextResponse.json(
        { error: "Post not found" },
        { status: 404 }
      )
    }

    const updatedPost = await prisma.post.update({
      where: { id: existingPost.id },
      data: {
        title: body.title,
        content: body.content,
        travelType: body.travelType || null, // Add travelType to the update
        imageUrl:body.imageUrl,
      },
    })

    return NextResponse.json(updatedPost, { status: 200 })
  } catch (error) {
    console.error('Error updating post:', error)
    return NextResponse.json(
      { error: "Failed to update post" },
      { status: 500 }
    )
  }
}

// DELETE post
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Validate ID is a number
    if (isNaN(parseInt(params.id))) {
      return NextResponse.json(
        { error: "Invalid post ID format" },
        { status: 400 }
      )
    }

    // Check if post exists
    const existingPost = await prisma.post.findUnique({
      where: { id: parseInt(params.id) }
    })

    if (!existingPost) {
      return NextResponse.json(
        { error: "Post not found" },
        { status: 404 }
      )
    }

    await prisma.post.delete({
      where: { id: existingPost.id }
    })

    return NextResponse.json(
      { message: "Post deleted successfully" },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error deleting post:', error)
    return NextResponse.json(
      { error: "Failed to delete post" },
      { status: 500 }
    )
  }
}