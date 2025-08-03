# syntax=docker.io/docker/dockerfile:1

# Base image
FROM node:18-alpine AS base

WORKDIR /app

# Required for Prisma CLI and native bindings
RUN apk add --no-cache libc6-compat openssl

# Install dependencies
FROM base AS deps
COPY package.json package-lock.json ./
RUN npm ci

# Build the app
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npx prisma generate
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

# Copy build output
COPY --from=builder /app/public ./public
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# Use the app user
USER nextjs

# Expose port
EXPOSE 3000

# Prisma migrate + start app using Next.js
CMD npx prisma migrate deploy && npm run start
