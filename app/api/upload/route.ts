// app/api/upload/route.ts
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file received' }, 
        { status: 400 }
      );
    }

    // For Vercel deployment, we'll return a placeholder URL
    // In production, you should use a cloud storage service like Cloudinary, AWS S3, etc.
    const filename = `${Date.now()}-${file.name.replace(/\s+/g, '-')}`;
    
    return NextResponse.json({
      success: true,
      url: `/uploads/${filename}`,
      message: 'File upload simulated. Use cloud storage for production.'
    });

  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}