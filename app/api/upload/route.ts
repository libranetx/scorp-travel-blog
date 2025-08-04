// app/api/upload/route.ts
import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    // Check admin authentication
    const authResult = await requireAdmin();
    if (authResult instanceof NextResponse) {
      return authResult;
    }
    
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file received' },
        { status: 400 }
      );
    }

    // For Vercel deployment, we'll use a placeholder image
    // In production, you should use a cloud storage service like Cloudinary, AWS S3, etc.
    const filename = `${Date.now()}-${file.name.replace(/\s+/g, '-')}`;
    
    // Use a placeholder image service or return a default image
    const placeholderUrl = `https://via.placeholder.com/800x600/cccccc/666666?text=${encodeURIComponent(file.name)}`;
    
    return NextResponse.json({
      success: true,
      url: placeholderUrl,
      filename: filename,
      message: 'Using placeholder image. For production, implement cloud storage.'
    });

  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}