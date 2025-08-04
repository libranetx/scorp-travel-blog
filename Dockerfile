# syntax=docker.io/docker/dockerfile:1

# Base image
FROM node:18-alpine AS base

WORKDIR /app

# Required for Prisma CLI and native bindings
RUN apk add --no-cache libc6-compat openssl

# Install dependencies
FROM base AS deps
# First copy only the files needed for dependency installation
COPY package.json package-lock.json* ./
# Check if package-lock.json exists and choose appropriate install command
RUN if [ -f package-lock.json ]; then npm ci; else npm install; fi
# Now copy Prisma files and generate client
COPY prisma ./prisma
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

# Copy build output and required files
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma
COPY --from=deps --chown=nextjs:nodejs /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=deps --chown=nextjs:nodejs /app/node_modules/@prisma ./node_modules/@prisma
COPY --from=deps --chown=nextjs:nodejs /app/node_modules ./node_modules

# Use the app user
USER nextjs

# Expose port
EXPOSE 3000

# Start app
CMD ["sh", "-c", "npx prisma migrate deploy && node server.js"]