import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// 1. Define the handler types explicitly for Next.js 15
type Handler = (
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) => Promise<NextResponse>

// 2. Implement each handler with explicit typing
const getHandler: Handler = async (request, { params }) => {
  try {
    const { id } = await params
    const postId = parseInt(id)
    if (isNaN(postId)) {
      return NextResponse.json(
        { error: "Invalid post ID format" },
        { status: 400 }
      )
    }

    const post = await prisma.post.findUnique({ where: { id: postId } })
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

const putHandler: Handler = async (request, { params }) => {
  try {
    const { id } = await params
    const postId = parseInt(id)
    if (isNaN(postId)) {
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

    const existingPost = await prisma.post.findUnique({ where: { id: postId } })
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
        travelType: body.travelType || null,
        imageUrl: body.imageUrl,
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

const deleteHandler: Handler = async (request, { params }) => {
  try {
    const { id } = await params
    const postId = parseInt(id)
    if (isNaN(postId)) {
      return NextResponse.json(
        { error: "Invalid post ID format" },
        { status: 400 }
      )
    }

    const existingPost = await prisma.post.findUnique({ where: { id: postId } })
    if (!existingPost) {
      return NextResponse.json(
        { error: "Post not found" },
        { status: 404 }
      )
    }

    await prisma.post.delete({ where: { id: existingPost.id } })
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

// 3. Export with proper typing
export const GET = getHandler
export const PUT = putHandler
export const DELETE = deleteHandler