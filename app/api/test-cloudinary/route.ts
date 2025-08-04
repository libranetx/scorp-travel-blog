import { NextResponse } from 'next/server';
import cloudinary from '@/lib/cloudinary';

export async function GET() {
  try {
    // Test Cloudinary configuration
    const config = {
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET ? '***' : 'MISSING'
    };

    // Test Cloudinary connection by getting account info
    const accountInfo = await cloudinary.api.ping();

    return NextResponse.json({
      success: true,
      message: 'Cloudinary configuration is working',
      config: {
        cloud_name: config.cloud_name,
        api_key: config.api_key,
        api_secret: config.api_secret
      },
      ping: accountInfo
    });

  } catch (error) {
    console.error('Cloudinary test error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      config: {
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET ? '***' : 'MISSING'
      }
    }, { status: 500 });
  }
} 