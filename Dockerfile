# syntax=docker.io/docker/dockerfile:1

# Base image
FROM node:18-alpine AS base

WORKDIR /app

# Required for Prisma CLI and native bindings
RUN apk add --no-cache libc6-compat openssl

# Install dependencies
FROM base AS deps
# First copy only package files
COPY package.json package-lock.json* ./
# Install dependencies (use ci if lockfile exists)
RUN if [ -f package-lock.json ]; then npm ci; else npm install; fi

# Copy prisma files separately
COPY prisma ./prisma
# Generate Prisma client
RUN npx prisma generate

# Build the app
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Production runtime image
FROM base AS runner

# Create app user
RUN addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 nextjs

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

# Copy required files with proper permissions
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma
COPY --from=deps --chown=nextjs:nodejs /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=deps --chown=nextjs:nodejs /app/node_modules/@prisma ./node_modules/@prisma
COPY --from=deps --chown=nextjs:nodejs /app/node_modules ./node_modules

# Use the app user
USER nextjs

EXPOSE 3000

# Start app (with migrations)
CMD ["sh", "-c", "npx prisma migrate deploy && node server.js"]