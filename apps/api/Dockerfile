## Multi-stage Dockerfile for apps/api
# Builds TypeScript sources and produces a small runtime image

FROM node:18-alpine AS builder
WORKDIR /app

# When the build context is `./apps/api` (as in compose), copy files relative to that context.
# Copy package files and tsconfig, install dev deps required for build
COPY package*.json ./
COPY tsconfig*.json ./
# Use flags to make npm install more robust inside the build environment
# --no-audit: skip audit network calls
# --no-fund: skip funding messages
# --legacy-peer-deps: avoid peer dependency conflicts during install
RUN npm install --silent --no-audit --no-fund --legacy-peer-deps

# Copy the rest of the app source and build
COPY . ./
RUN npm run build

## Runtime image
FROM node:18-alpine AS runner
WORKDIR /app

# Copy built artifacts and package files from builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./

ENV NODE_ENV=production

# Install only production dependencies
RUN npm install --production --silent

EXPOSE 4000

CMD ["node", "dist/index.js"]
