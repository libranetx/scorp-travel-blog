# Quick Setup: Vercel + Vercel Postgres

## 🚀 Quick Start (5 minutes)

### 1. Run Setup Script
```bash
chmod +x scripts/setup-vercel.sh
./scripts/setup-vercel.sh
```

### 2. Database is already configured
Your Prisma Data Platform database is already set up with:
- **DATABASE_URL**: Direct connection to PostgreSQL
- **PRISMA_DATABASE_URL**: Accelerated connection for better performance
- **POSTGRES_URL**: Direct URL for migrations

### 3. Deploy on Vercel
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New Project"
3. Import your GitHub repository
4. Vercel will auto-detect Next.js

### 4. Set Environment Variables
In Vercel project settings → Environment Variables:

```
DATABASE_URL=postgres://8fc8e7593b3706559a1ab39b28bc66d03aa7a345a02bd5e68cf0e327ca22fbe7:sk_7DiF7c2DYaiKsRuUWXOgq@db.prisma.io:5432/?sslmode=require
PRISMA_DATABASE_URL=prisma+postgres://accelerate.prisma-data.net/?api_key=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqd3RfaWQiOjEsInNlY3VyZV9rZXkiOiJza183RGlGN2MyRFlhaUtzUnVVV1hPZ3EiLCJhcGlfa2V5IjoiMDFLMVRGVFhXRVQyUzQwRzNUTlFSRlJBQjMiLCJ0ZW5hbnRfaWQiOiI4ZmM4ZTc1OTNiMzcwNjU1OWExYWIzOWIyOGJjNjZkMDNhYTdhMzQ1YTAyYmQ1ZTY4Y2YwZTMyN2NhMjJmYmU3IiwiaW50ZXJuYWxfc2VjcmV0IjoiODhjZTI1YzItY2U3NS00ODA2LTkyYzItMjVkMTQ3OWNkMzk2In0.B6M-2gcXjhjapWlaBZQewoRlIPyq3I0BFEt86w5lkG0
POSTGRES_URL=postgres://8fc8e7593b3706559a1ab39b28bc66d03aa7a345a02bd5e68cf0e327ca22fbe7:sk_7DiF7c2DYaiKsRuUWXOgq@db.prisma.io:5432/?sslmode=require
NEXTAUTH_URL=https://your-app.vercel.app
NEXTAUTH_SECRET=your-generated-secret
UPLOAD_DIR=./public/uploads
```

**Database URLs are already configured for Prisma Data Platform**

### 5. Deploy!
- Push to GitHub
- Vercel auto-deploys
- Check your app URL

## 🔧 Manual Setup

### Install Vercel CLI
```bash
npm i -g vercel
```

### Link Project
```bash
vercel link
```

### Pull Environment Variables
```bash
vercel env pull .env.local
```

### Deploy
```bash
vercel --prod
```

## 📋 Environment Variables

| Variable | Value | Source |
|----------|-------|--------|
| `DATABASE_URL` | `postgres://...` | Prisma Data Platform |
| `PRISMA_DATABASE_URL` | `prisma+postgres://...` | Prisma Data Platform |
| `POSTGRES_URL` | `postgres://...` | Prisma Data Platform |
| `NEXTAUTH_URL` | `https://your-app.vercel.app` | Your Vercel app URL |
| `NEXTAUTH_SECRET` | `random-string` | Generate with `openssl rand -base64 32` |

## 🎯 What's Configured

- ✅ Vercel deployment config (`vercel.json`)
- ✅ Prisma + PostgreSQL setup
- ✅ NextAuth.js configuration
- ✅ Environment variables template
- ✅ Build scripts for Vercel
- ✅ Docker configuration (if needed)

## 🚨 Important Notes

1. **File Uploads**: Vercel has ephemeral storage. Use Cloudinary/S3 for production
2. **Database**: Vercel Postgres includes automatic backups
3. **SSL**: Automatic SSL certificates
4. **Custom Domains**: Available in Vercel settings

## 📚 Full Guide

See [DEPLOYMENT-VERCEL.md](./DEPLOYMENT-VERCEL.md) for detailed instructions. 