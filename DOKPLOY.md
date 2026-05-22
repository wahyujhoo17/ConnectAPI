# Dokploy Deployment Guide

This repo is a monorepo with **npm workspaces**. The `apps/api` depends on `packages/database` (Prisma), so all Docker builds for the API **must use the repository root as build context**.

## Architecture

```
wavo-monorepo/
├── apps/
│   ├── api/          ← Fastify backend (depends on packages/database)
│   └── engine/       ← Next.js frontend (standalone, no workspace deps)
├── packages/
│   └── database/     ← Prisma client + migrations
├── docker/
│   └── api.Dockerfile
├── docker-compose.dokploy.yml
└── package.json      ← Root workspace config
```

## Option 1: Docker Compose (Recommended)

Deploy the full stack (API + Frontend + Postgres + Redis + MinIO) using Compose.

### Steps

1. In Dokploy → Actions → **Compose** (or "New App" → Compose).
2. Point to this repository, branch `main`, Compose file path: `docker-compose.dokploy.yml`.
3. **Before deploying**, add these as Dokploy Secrets (override the placeholder values):
   - `DATABASE_URL` — Postgres connection string
   - `REDIS_URL` — Redis connection string
   - `JWT_PRIVATE_KEY` / `JWT_PUBLIC_KEY` — Auth keys
   - `ENCRYPTION_KEY` — Exactly 32 characters
   - `MINIO_ACCESS_KEY` / `MINIO_SECRET_KEY` — Object storage credentials
4. Deploy and watch logs.

## Option 2: Individual App Deployment

### API Backend

1. Create a new app in Dokploy pointing to this repository.
2. **Build context**: `.` (repository root) — **NOT** `apps/api`.
3. **Dockerfile path**: `docker/api.Dockerfile` (or `apps/api/Dockerfile` — they are identical).
4. Add required secrets:
   - `DATABASE_URL`, `REDIS_URL`
   - `JWT_PRIVATE_KEY`, `JWT_PUBLIC_KEY`, `ENCRYPTION_KEY`
   - `MINIO_ENDPOINT`, `MINIO_PORT`, `MINIO_ACCESS_KEY`, `MINIO_SECRET_KEY`
   - `NODE_ENV=production`, `PORT=4000`
5. Deploy.

### Engine Frontend

1. Create a new app in Dokploy pointing to this repository.
2. **Build context**: `apps/engine`
3. **Dockerfile path**: `apps/engine/Dockerfile`
4. Add required secrets:
   - `NEXT_PUBLIC_API_URL` — e.g. `https://api.yourdomain.com`
   - `NEXT_PUBLIC_WS_URL` — e.g. `wss://api.yourdomain.com`
   - `NODE_ENV=production`, `PORT=3000`
5. Deploy.

## Important Notes

> **⚠️ Build Context**: The API Dockerfile **must** use the repo root (`.`) as build context because `apps/api` depends on the workspace package `packages/database`. Setting the context to `apps/api` will cause `npm install` to fail with exit code 254.

> **🔒 Secrets**: Never commit real secrets to Git. Use `env-examples/` for reference and add actual values through Dokploy's Secrets UI.

> **🏭 Production**: For production, consider using managed services (Postgres, Redis, Object Storage) instead of running them in Docker containers. Set their connection URLs as Dokploy secrets.

## CI/CD

A GitHub Actions workflow exists at `.github/workflows/build-and-push.yml` to build and push images to GHCR if you prefer registry-based deployment.
