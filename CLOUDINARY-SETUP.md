# Cloudinary Setup Guide

## Overview
This guide will help you set up Cloudinary for image uploads in your blog application. Cloudinary provides cloud-based image and video management services with automatic optimization and transformation capabilities.

## Step 1: Create a Cloudinary Account

1. Go to [Cloudinary's website](https://cloudinary.com/)
2. Click "Sign Up" and create a free account
3. Verify your email address

## Step 2: Get Your Cloudinary Credentials

After signing up, you'll find your credentials in your Cloudinary Dashboard:

1. Log in to your Cloudinary Dashboard
2. Go to the "Dashboard" section
3. Copy the following information:
   - **Cloud Name** (e.g., `my-cloud-name`)
   - **API Key** (e.g., `123456789012345`)
   - **API Secret** (e.g., `abcdefghijklmnopqrstuvwxyz`)

## Step 3: Configure Environment Variables

Add the following variables to your `.env` file:

```env
# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"
```

**Important:** Replace the placeholder values with your actual Cloudinary credentials.

## Step 4: Update Your Environment Files

### For Local Development
Add the Cloudinary variables to your `.env.local` file:

```env
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

### For Production (Vercel)
1. Go to your Vercel project dashboard
2. Navigate to "Settings" → "Environment Variables"
3. Add the three Cloudinary variables with your production values

## Step 5: Test the Setup

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Sign in as an admin user
3. Try creating a new post with an image upload
4. The image should be uploaded to Cloudinary and displayed in your post

## Features Implemented

### ✅ Image Upload
- Automatic image optimization
- File type validation (images only)
- File size validation (max 5MB)
- Secure upload with admin authentication

### ✅ Image Management
- Images stored in Cloudinary's cloud
- Automatic image transformations (resize, optimize)
- Secure HTTPS URLs
- Organized folder structure (`blog-app/`)

### ✅ Image Deletion
- Automatic cleanup when posts are deleted
- Prevents orphaned images in Cloudinary
- Graceful error handling

### ✅ Database Integration
- Stores image URLs and public IDs
- Links images to posts
- Maintains data consistency

## Image Transformations

Cloudinary automatically applies the following transformations to uploaded images:

- **Size**: Limited to 800x600 pixels (maintains aspect ratio)
- **Quality**: Automatic optimization
- **Format**: Automatic format selection (WebP, JPEG, etc.)
- **Folder**: Organized in `blog-app/` folder

## Security Features

### ✅ Authentication Required
- Only authenticated admin users can upload images
- API routes protected with role-based access control

### ✅ File Validation
- Only image files allowed (JPEG, PNG, GIF, WebP, etc.)
- Maximum file size: 5MB
- File type validation on both client and server

### ✅ Secure URLs
- All images served over HTTPS
- Cloudinary's secure delivery network
- No direct access to original files

## Troubleshooting

### Common Issues

1. **"Cloudinary configuration error"**
   - Check that all environment variables are set correctly
   - Verify your Cloudinary credentials are valid

2. **"File upload failed"**
   - Ensure the file is an image (JPEG, PNG, GIF, etc.)
   - Check that the file size is under 5MB
   - Verify you're signed in as an admin user

3. **"Image not displaying"**
   - Check the image URL in the database
   - Verify the image exists in your Cloudinary account
   - Check browser console for any errors

### Debug Steps

1. Check environment variables:
   ```bash
   echo $CLOUDINARY_CLOUD_NAME
   echo $CLOUDINARY_API_KEY
   echo $CLOUDINARY_API_SECRET
   ```

2. Test Cloudinary connection:
   ```javascript
   // Add this to a test route temporarily
   const cloudinary = require('cloudinary').v2;
   console.log('Cloudinary config:', {
     cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
     api_key: process.env.CLOUDINARY_API_KEY,
     api_secret: process.env.CLOUDINARY_API_SECRET ? '***' : 'NOT SET'
   });
   ```

## Cost Considerations

### Free Tier Limits
- **Storage**: 25 GB
- **Bandwidth**: 25 GB/month
- **Transformations**: 25,000/month
- **Uploads**: 25,000/month

### For Production
- Monitor your usage in Cloudinary Dashboard
- Consider upgrading if you exceed free limits
- Implement image optimization strategies

## Best Practices

1. **Image Optimization**
   - Use appropriate image formats (WebP for web)
   - Compress images before upload when possible
   - Consider implementing lazy loading

2. **Security**
   - Never expose API secrets in client-side code
   - Use environment variables for all credentials
   - Implement proper authentication for uploads

3. **Performance**
   - Use Cloudinary's automatic optimization
   - Consider implementing image caching
   - Monitor bandwidth usage

## Migration from Local Storage

If you're migrating from local file storage:

1. **Backup existing images** before making changes
2. **Upload existing images** to Cloudinary
3. **Update database records** with new URLs and public IDs
4. **Test thoroughly** before deploying to production

## Support

- [Cloudinary Documentation](https://cloudinary.com/documentation)
- [Cloudinary API Reference](https://cloudinary.com/documentation/admin_api)
- [Cloudinary Support](https://support.cloudinary.com/)

## Next Steps

After setting up Cloudinary, consider implementing:

1. **Image Gallery**: Multiple image uploads per post
2. **Image Editing**: Basic image transformations in the UI
3. **CDN Integration**: Faster image delivery
4. **Backup Strategy**: Regular backups of image metadata
5. **Analytics**: Track image usage and performance 