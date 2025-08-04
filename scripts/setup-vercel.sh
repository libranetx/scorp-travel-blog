#!/bin/bash

# Vercel Deployment Setup Script
echo "🚀 Setting up Vercel deployment configuration..."

# Check if .env file exists
if [ ! -f .env ]; then
    echo "📝 Creating .env file from template..."
    cp env.example .env
    echo "⚠️  Please update .env with your actual values"
else
    echo "✅ .env file already exists"
fi

# Check if all required files exist
echo "🔍 Checking deployment files..."

files=("vercel.json" "env.example" "DEPLOYMENT-VERCEL.md")
for file in "${files[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ $file exists"
    else
        echo "❌ $file missing"
    fi
done

# Generate a random NEXTAUTH_SECRET if not set
if ! grep -q "NEXTAUTH_SECRET" .env || grep -q "your-nextauth-secret-key" .env; then
    echo "🔑 Generating NEXTAUTH_SECRET..."
    SECRET=$(openssl rand -base64 32)
    echo "Generated NEXTAUTH_SECRET: $SECRET"
    echo "Please add this to your .env file: NEXTAUTH_SECRET=$SECRET"
fi

# Check if Vercel CLI is installed
if command -v vercel &> /dev/null; then
    echo "✅ Vercel CLI is installed"
else
    echo "📦 Installing Vercel CLI..."
    npm install -g vercel
fi

echo ""
echo "📋 Next steps:"
echo "1. Update .env with your actual values"
echo "2. Create a Vercel Postgres database"
echo "3. Deploy your app on Vercel"
echo "4. Set environment variables in Vercel dashboard"
echo "5. Follow the detailed guide in DEPLOYMENT-VERCEL.md"
echo ""
echo "🎉 Setup complete! Happy deploying on Vercel!" 