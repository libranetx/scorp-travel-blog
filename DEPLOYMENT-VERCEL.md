# Deployment Guide: Vercel + Prisma Data Platform

This guide will help you deploy your Next.js blog app on Vercel with Prisma Data Platform database.

## Prerequisites

1. GitHub account with your code repository
2. Vercel account (https://vercel.com)
3. Vercel CLI (optional but recommended)

## Step 1: Set up Prisma Data Platform Database

### 1.1 Database is already configured

Your Prisma Data Platform database is already set up with the following connection details:

- **DATABASE_URL**: Direct connection to your PostgreSQL database
- **PRISMA_DATABASE_URL**: Accelerated connection for better performance
- **POSTGRES_URL**: Direct URL for migrations and direct access

### 1.2 Database connection details

Your database connection strings are configured in `env.example`:

```
DATABASE_URL="postgres://8fc8e7593b3706559a1ab39b28bc66d03aa7a345a02bd5e68cf0e327ca22fbe7:sk_7DiF7c2DYaiKsRuUWXOgq@db.prisma.io:5432/?sslmode=require"
PRISMA_DATABASE_URL="prisma+postgres://accelerate.prisma-data.net/?api_key=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqd3RfaWQiOjEsInNlY3VyZV9rZXkiOiJza183RGlGN2MyRFlhaUtzUnVVV1hPZ3EiLCJhcGlfa2V5IjoiMDFLMVRGVFhXRVQyUzQwRzNUTlFSRlJBQjMiLCJ0ZW5hbnRfaWQiOiI4ZmM4ZTc1OTNiMzcwNjU1OWExYWIzOWIyOGJjNjZkMDNhYTdhMzQ1YTAyYmQ1ZTY4Y2YwZTMyN2NhMjJmYmU3IiwiaW50ZXJuYWxfc2VjcmV0IjoiODhjZTI1YzItY2U3NS00ODA2LTkyYzItMjVkMTQ3OWNkMzk2In0.B6M-2gcXjhjapWlaBZQewoRlIPyq3I0BFEt86w5lkG0"
POSTGRES_URL="postgres://8fc8e7593b3706559a1ab39b28bc66d03aa7a345a02bd5e68cf0e327ca22fbe7:sk_7DiF7c2DYaiKsRuUWXOgq@db.prisma.io:5432/?sslmode=require"
```

## Step 2: Deploy your app on Vercel

### 2.1 Connect your GitHub repository

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New Project"
3. Import your GitHub repository
4. Vercel will automatically detect it's a Next.js project

### 2.2 Configure environment variables

1. In your Vercel project settings, go to "Environment Variables"
2. Add the following variables:

```
DATABASE_URL=postgres://8fc8e7593b3706559a1ab39b28bc66d03aa7a345a02bd5e68cf0e327ca22fbe7:sk_7DiF7c2DYaiKsRuUWXOgq@db.prisma.io:5432/?sslmode=require
PRISMA_DATABASE_URL=prisma+postgres://accelerate.prisma-data.net/?api_key=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqd3RfaWQiOjEsInNlY3VyZV9rZXkiOiJza183RGlGN2MyRFlhaUtzUnVVV1hPZ3EiLCJhcGlfa2V5IjoiMDFLMVRGVFhXRVQyUzQwRzNUTlFSRlJBQjMiLCJ0ZW5hbnRfaWQiOiI4ZmM4ZTc1OTNiMzcwNjU1OWExYWIzOWIyOGJjNjZkMDNhYTdhMzQ1YTAyYmQ1ZTY4Y2YwZTMyN2NhMjJmYmU3IiwiaW50ZXJuYWxfc2VjcmV0IjoiODhjZTI1YzItY2U3NS00ODA2LTkyYzItMjVkMTQ3OWNkMzk2In0.B6M-2gcXjhjapWlaBZQewoRlIPyq3I0BFEt86w5lkG0
POSTGRES_URL=postgres://8fc8e7593b3706559a1ab39b28bc66d03aa7a345a02bd5e68cf0e327ca22fbe7:sk_7DiF7c2DYaiKsRuUWXOgq@db.prisma.io:5432/?sslmode=require
NEXTAUTH_URL=https://your-app.vercel.app
NEXTAUTH_SECRET=your-super-secret-key-here
UPLOAD_DIR=./public/uploads
```

**Important Notes:**
- The DATABASE_URL is already configured for your Prisma Data Platform database
- Generate a strong NEXTAUTH_SECRET (you can use `openssl rand -base64 32`)
- The NEXTAUTH_URL should match your Vercel app URL

### 2.3 Deploy the application

1. Vercel will automatically build and deploy your app
2. The build process will:
   - Install dependencies
   - Generate Prisma client
   - Run database migrations
   - Build the Next.js application

### 2.4 Configure custom domain (optional)

1. In Vercel, go to your project settings
2. Click "Domains"
3. Add your custom domain and configure DNS

## Step 3: Database Migration

### 3.1 Run migrations on production

Your app should automatically run migrations during deployment, but you can also run them manually:

1. Install Vercel CLI: `npm i -g vercel`
2. Run migrations:
   ```bash
   vercel env pull .env.local
   npx prisma migrate deploy
   ```

## Step 4: Verify Deployment

1. Check your Vercel app URL
2. Test the following functionality:
   - Home page loads
   - User registration/login
   - Post creation and viewing
   - Image uploads (if implemented)

## Step 5: Set up Vercel CLI (Optional but Recommended)

### 5.1 Install Vercel CLI

```bash
npm i -g vercel
```

### 5.2 Link your project

```bash
vercel link
```

### 5.3 Pull environment variables

```bash
vercel env pull .env.local
```

## Troubleshooting

### Common Issues:

1. **Database Connection Errors**
   - Verify DATABASE_URL is correct
   - Check if Vercel Postgres is accessible
   - Ensure database user has proper permissions

2. **Build Failures**
   - Check Vercel build logs
   - Verify all dependencies are in package.json
   - Ensure Prisma schema is valid

3. **Environment Variables**
   - Double-check all environment variables are set
   - Verify NEXTAUTH_URL matches your app URL
   - Ensure NEXTAUTH_SECRET is properly set

4. **File Upload Issues**
   - Vercel has ephemeral storage, consider using external storage
   - For production, use services like Cloudinary or AWS S3

## Production Considerations

1. **File Storage**: Vercel has ephemeral storage. For production, use:
   - Cloudinary for image uploads
   - AWS S3 for file storage
   - Or implement external storage solution

2. **Database Backups**: Vercel Postgres includes automatic backups

3. **Monitoring**: Use Vercel's built-in analytics and logs

4. **SSL**: Vercel provides automatic SSL certificates

5. **Edge Functions**: Consider using Vercel Edge Functions for better performance

## Environment Variables Reference

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | PostgreSQL connection string | Yes |
| `PRISMA_DATABASE_URL` | Accelerated Prisma connection | Yes |
| `POSTGRES_URL` | Direct PostgreSQL connection | Yes |
| `NEXTAUTH_URL` | Your app's public URL | Yes |
| `NEXTAUTH_SECRET` | Secret key for NextAuth | Yes |
| `UPLOAD_DIR` | Directory for file uploads | No |

## Vercel-Specific Features

1. **Automatic Deployments**: Every push to main branch triggers deployment
2. **Preview Deployments**: Pull requests get preview deployments
3. **Edge Functions**: Serverless functions at the edge
4. **Analytics**: Built-in performance monitoring
5. **Edge Config**: Global configuration management

## Support

- Vercel Documentation: https://vercel.com/docs
- Vercel Postgres Documentation: https://vercel.com/docs/storage/vercel-postgres
- Next.js Documentation: https://nextjs.org/docs
- Prisma Documentation: https://www.prisma.io/docs 