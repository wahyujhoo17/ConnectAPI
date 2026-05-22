## Multi-stage Dockerfile for apps/api
# Builds TypeScript sources and produces a small runtime image

FROM node:18-alpine AS builder
WORKDIR /app

# Copy package files for the api subfolder and install deps (including dev deps for build)
COPY apps/api/package*.json ./
COPY apps/api/tsconfig*.json ./
RUN npm ci

# Copy only the api source to keep context small
COPY apps/api ./apps/api
WORKDIR /app/apps/api

# Build the TypeScript project
RUN npm run build

## Runtime image
FROM node:18-alpine AS runner
WORKDIR /app

# Copy built artifacts and package files from builder
COPY --from=builder /app/apps/api/dist ./dist
COPY --from=builder /app/apps/api/package*.json ./

ENV NODE_ENV=production

# Install only production dependencies
RUN npm ci --production

EXPOSE 4000

CMD ["node", "dist/index.js"]
