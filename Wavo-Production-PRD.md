# Wavo — Open Source WhatsApp API Platform

**Production PRD & System Architecture**
**Version 3.0 — Production Ready**
**Last Updated**: 2026-05-17
**Status**: Production Specification

---

# 1. Executive Summary

Wavo adalah platform open-source WhatsApp API modern berbasis Baileys yang memungkinkan developer membuat instance WhatsApp API mereka sendiri melalui dashboard web modern.

## Core Capabilities

| Capability | Description |
|---|---|
| Multi-Instance | Menjalankan banyak WhatsApp session dalam 1 deployment |
| REST API | Kirim pesan text, image, document, bulk via HTTP API |
| Webhook System | Terima incoming messages & status updates via webhook |
| Queue Messaging | BullMQ-based priority queue dengan retry & DLQ |
| Realtime Dashboard | Live monitoring sessions, logs, queue via WebSocket |
| Admin Panel | Manage users, limits, configs, system health |
| Anti-Ban Engine | Human-like messaging, rate limiting, burst prevention |
| Self-Hostable | Docker Compose (dev) / Kubernetes (production) |

## Target Users

| Segment | Use Case |
|---|---|
| Developer | Build WhatsApp bots, integrations |
| Startup | Customer engagement, notifications |
| UMKM | Order notifications, CS automation |
| Enterprise | CRM integration, bulk campaigns |
| Internal Tools | Alert systems, monitoring notifications |

---

# 2. Product Vision & Positioning

## Vision
Menjadi platform open-source WhatsApp API #1 yang production-ready, developer-friendly, dan enterprise-grade.

## Competitive Analysis

| Feature | Wavo | Evolution API | WPPConnect | Twilio | UltraMsg |
|---|---|---|---|---|---|
| Open Source | ✅ | ✅ | ✅ | ❌ | ❌ |
| Modern Dashboard | ✅ | ⚠️ | ❌ | ✅ | ⚠️ |
| Multi-Instance | ✅ | ✅ | ✅ | ✅ | ❌ |
| Queue System | ✅ BullMQ | ❌ | ❌ | ✅ | ❌ |
| Anti-Ban Engine | ✅ Advanced | ⚠️ Basic | ❌ | N/A | ❌ |
| Self-Hostable | ✅ | ✅ | ✅ | ❌ | ❌ |
| Realtime WS | ✅ | ⚠️ | ❌ | ✅ | ❌ |

## Differentiation
1. **Anti-ban engine** — typing simulation, randomized delays, spam detection
2. **Priority queue** — enterprise messages processed first
3. **Modern UI** — Supabase/Vercel-grade dashboard
4. **Full observability** — Prometheus + Grafana + OpenTelemetry built-in

---

# 3. Business Model

| Tier | Price | Instances | Messages/day | Queue Priority | Support |
|---|---|---|---|---|---|
| Free | $0 | 1 | 100 | Low | Community |
| Pro | $29/mo | 5 | 5,000 | Medium | Email |
| Business | $99/mo | 20 | 50,000 | High | Priority |
| Enterprise | Custom | Unlimited | Unlimited | Highest | Dedicated |

**License**: MIT (core platform free & open source forever)

---

# 4. Non-Functional Requirements (NFR)

> **Ini section yang paling kritis untuk production readiness.**

## Performance Targets

| Metric | Target | Measurement |
|---|---|---|
| API Response Time (p50) | < 100ms | Prometheus histogram |
| API Response Time (p95) | < 300ms | Prometheus histogram |
| API Response Time (p99) | < 1s | Prometheus histogram |
| Message Queue Latency (free) | < 30s | BullMQ metrics |
| Message Queue Latency (pro) | < 10s | BullMQ metrics |
| Message Queue Latency (enterprise) | < 3s | BullMQ metrics |
| WebSocket Event Delivery | < 500ms | OpenTelemetry trace |
| Dashboard Page Load (LCP) | < 2.5s | Lighthouse |

## Availability & Reliability

| Metric | Target |
|---|---|
| Uptime SLA | 99.9% (8.76h downtime/year) |
| Recovery Time Objective (RTO) | < 15 minutes |
| Recovery Point Objective (RPO) | < 5 minutes |
| Mean Time To Recovery (MTTR) | < 30 minutes |

## Scalability Targets

| Metric | Minimum | Recommended |
|---|---|---|
| Concurrent WA Sessions | 50 | 500 |
| Messages per Second | 10 msg/s | 100 msg/s |
| Concurrent API Requests | 100 req/s | 1,000 req/s |
| WebSocket Connections | 500 | 5,000 |
| Database Connections (pooled) | 20 | 100 |

## Data Retention

| Data Type | Retention | Storage |
|---|---|---|
| Message Logs | 90 days | TimescaleDB (auto-compress after 7d) |
| Webhook Delivery Logs | 30 days | TimescaleDB |
| Audit Logs | 1 year | PostgreSQL |
| WA Session Data | Until deleted | MinIO/S3 |
| API Request Logs | 30 days | Loki |
| Metrics | 90 days | Prometheus/Mimir |

## Browser & Device Support

| Browser | Version |
|---|---|
| Chrome | Last 2 versions |
| Firefox | Last 2 versions |
| Safari | Last 2 versions |
| Edge | Last 2 versions |
| Mobile (PWA) | iOS Safari 15+, Chrome Android 90+ |

---

# 5. Technology Stack

## Frontend

| Technology | Version | Purpose |
|---|---|---|
| Next.js | 15+ | React framework, SSR/SSG |
| TypeScript | 5+ | Type safety |
| TailwindCSS | 4+ | Utility-first CSS |
| shadcn/ui | Latest | Component library |
| Framer Motion | 12+ | Animations |
| Zustand | 5+ | Client state management |
| SWR | 2+ | Data fetching & caching |
| Zod | 3+ | Schema validation |

## Backend

| Technology | Version | Purpose |
|---|---|---|
| Node.js | 20 LTS | Runtime |
| Fastify | 5+ | HTTP framework |
| Socket.IO | 4+ | WebSocket realtime |
| Zod | 3+ | Request validation |
| Pino | 9+ | Structured logging |
| Baileys | Latest | WhatsApp Web protocol |

## Data Layer

| Technology | Version | Purpose |
|---|---|---|
| PostgreSQL | 15+ | Primary database |
| TimescaleDB | 2.x | Time-series logs & metrics |
| Prisma | 6+ | ORM & migrations |
| PgBouncer | 1.21+ | Connection pooling |
| Redis | 7+ | Cache, queue broker, pub/sub |
| BullMQ | 5+ | Job queue |
| MinIO / S3 | Latest | Object storage (media, sessions) |

## Infrastructure

| Technology | Purpose |
|---|---|
| Docker | Containerization |
| Docker Compose | Development environment |
| Kubernetes | Production orchestration |
| Nginx / Caddy | Reverse proxy, TLS termination |
| Prometheus | Metrics collection |
| Grafana | Dashboards & alerting |
| Loki | Log aggregation |
| OpenTelemetry | Distributed tracing |
| Sentry | Error tracking |

---

# 6. System Architecture

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        INTERNET                              │
└──────────────────────┬──────────────────────────────────────┘
                       │
              ┌────────▼────────┐
              │  Nginx / Caddy  │  TLS termination, rate limit
              │  (Reverse Proxy)│  
              └───┬────────┬────┘
                  │        │
        ┌─────────▼──┐  ┌──▼──────────┐
        │  Next.js   │  │  Fastify    │
        │  Frontend  │  │  API Server │
        │  :3000     │  │  :4000      │
        └────────────┘  └──┬───┬──────┘
                           │   │
                    ┌──────▼┐ ┌▼───────┐
                    │ Redis │ │ PgSQL  │
                    │ :6379 │ │ :5432  │
                    └───┬───┘ └────────┘
                        │
              ┌─────────▼─────────┐
              │   BullMQ Workers  │
              │  (Message Queue)  │
              └─────────┬─────────┘
                        │
              ┌─────────▼─────────┐
              │  Baileys Workers  │
              │  (WA Engine Pool) │
              └───────────────────┘
```

## Service Breakdown

| Service | Port | Replicas (Prod) | Resources |
|---|---|---|---|
| Next.js Frontend | 3000 | 2 | 512MB RAM, 0.5 CPU |
| Fastify API | 4000 | 3 | 1GB RAM, 1 CPU |
| Baileys Worker | — | 2-10 (HPA) | 2GB RAM, 1 CPU per worker |
| Queue Worker | — | 2-5 (HPA) | 1GB RAM, 0.5 CPU |
| PostgreSQL | 5432 | 1 primary + 1 replica | 4GB RAM, 2 CPU |
| Redis | 6379 | 3 (Sentinel) | 2GB RAM, 1 CPU |
| PgBouncer | 6432 | 2 | 256MB RAM, 0.25 CPU |
| MinIO | 9000 | 1 (dev) / 4 (prod) | 2GB RAM, 1 CPU |

## Communication Patterns

| From | To | Protocol | Pattern |
|---|---|---|---|
| Frontend | API | HTTPS REST | Request/Response |
| Frontend | API | WebSocket (Socket.IO) | Bidirectional realtime |
| API | Queue | Redis (BullMQ) | Async job dispatch |
| Queue Worker | Baileys Worker | Internal RPC | Message execution |
| API | Webhook Consumer | HTTPS POST | Event delivery |
| Baileys Worker | API | Redis Pub/Sub | Status & message events |

---

# 7. User Roles & Permissions (RBAC)

| Permission | Super Admin | Admin | User Pro | User Free |
|---|---|---|---|---|
| Manage all users | ✅ | ✅ | ❌ | ❌ |
| View system analytics | ✅ | ✅ | ❌ | ❌ |
| Configure rate limits | ✅ | ❌ | ❌ | ❌ |
| Manage infrastructure | ✅ | ❌ | ❌ | ❌ |
| Manage queue config | ✅ | ✅ | ❌ | ❌ |
| Create WA instances | ✅ | ✅ | ✅ (5 max) | ✅ (1 max) |
| Send messages | ✅ | ✅ | ✅ (5k/day) | ✅ (100/day) |
| View own analytics | ✅ | ✅ | ✅ | ✅ |
| Manage API keys | ✅ | ✅ | ✅ | ✅ |
| Configure webhooks | ✅ | ✅ | ✅ | ✅ |
| Bulk messaging | ✅ | ✅ | ✅ | ❌ |
| Priority queue | ✅ | ✅ | ✅ | ❌ |

---

# 8. Rate Limiting Specification

## API Rate Limits

| Endpoint Group | Free | Pro | Business | Enterprise |
|---|---|---|---|---|
| Auth (`/auth/*`) | 5/min | 10/min | 20/min | 50/min |
| Send Message | 10/min | 50/min | 200/min | 1,000/min |
| Send Bulk | ❌ | 5/min | 20/min | 100/min |
| Read Endpoints | 60/min | 300/min | 1,000/min | 5,000/min |
| Webhook Config | 10/min | 30/min | 60/min | 200/min |
| File Upload | 5/min | 20/min | 50/min | 200/min |

## Daily Quotas

| Resource | Free | Pro | Business | Enterprise |
|---|---|---|---|---|
| Messages Sent | 100/day | 5,000/day | 50,000/day | Unlimited |
| Media Uploads | 10/day | 500/day | 5,000/day | Unlimited |
| Webhook Deliveries | 200/day | 10,000/day | 100,000/day | Unlimited |
| API Calls | 1,000/day | 50,000/day | 500,000/day | Unlimited |

## Rate Limit Response Headers

```http
X-RateLimit-Limit: 50
X-RateLimit-Remaining: 23
X-RateLimit-Reset: 1716000000
Retry-After: 30
```

## Rate Limit Response Body (429)

```json
{
  "error": "rate_limit_exceeded",
  "message": "You have exceeded the rate limit of 50 requests per minute",
  "retryAfter": 30,
  "limit": 50,
  "remaining": 0,
  "resetAt": "2026-05-17T12:35:00Z"
}
```

---

# 9. Anti-Ban Strategy

## Human-Like Messaging Engine

| Technique | Implementation | Config |
|---|---|---|
| Typing Simulation | `presenceUpdate('composing')` before send | 1-3s randomized |
| Read Receipt Delay | `markRead()` with random delay | 0.5-2s |
| Inter-Message Delay | Random delay between consecutive sends | 3-15s |
| Burst Prevention | Max N messages in sliding window | 20 msg/5min |
| Daily Pattern | Reduce sending during night hours | 22:00-06:00 throttle |
| Cooldown Period | Pause after X messages | 5min pause per 100 msgs |

## Session Protection

| Strategy | Detail |
|---|---|
| Exponential Reconnect | Base 1s, max 5min, jitter ±30% |
| Session Persistence | Encrypted to MinIO/S3, restore on reconnect |
| Health Check | Ping every 30s, reconnect after 3 failed |
| Graceful Disconnect | Close session properly before shutdown |

## Abuse Prevention

| Rule | Action |
|---|---|
| > 500 msg/hour to unique numbers | Warning + temporary throttle |
| > 1000 msg/day (free tier) | Auto-suspend instance |
| Spam pattern detected (same message to 50+ numbers) | Suspend + admin notification |
| Repeated failed sends (> 50% failure rate) | Auto-pause + user notification |

---

# 10. Core Features Specification

## 10.1 Authentication

### Flows
1. **Email/Password** — bcrypt hash, min 8 chars, complexity rules
2. **Google OAuth** — via `passport-google-oauth20`
3. **JWT Auth** — Access token (15min) + Refresh token (7 days)
4. **Refresh Token Rotation** — New refresh token on each use, old one invalidated

### Token Specification

```
Access Token:
  - Algorithm: RS256
  - Expiry: 15 minutes
  - Payload: { sub, email, role, plan, iat, exp }

Refresh Token:
  - Algorithm: RS256
  - Expiry: 7 days
  - Stored: PostgreSQL (hashed)
  - Rotation: Issue new on each refresh, revoke old
  - Family tracking: Detect reuse attacks
```

## 10.2 WhatsApp Instance Management

| Feature | Detail |
|---|---|
| Create Instance | Name, slug (auto-generated), webhook URL |
| QR Authentication | Generate QR → scan → session established |
| Session Persistence | Encrypted & stored in MinIO, auto-restore on boot |
| Reconnect Handling | Exponential backoff with jitter |
| Status Monitoring | `connecting` → `qr_pending` → `connected` → `disconnected` |
| Device Info | Phone number, platform, battery level |
| Instance Limits | Per-plan limits enforced at API layer |

## 10.3 Messaging API

### Supported Message Types

| Type | Endpoint | Max Size |
|---|---|---|
| Text | `POST /api/v1/send/text` | 4,096 chars |
| Image | `POST /api/v1/send/image` | 16 MB |
| Document | `POST /api/v1/send/document` | 100 MB |
| Audio | `POST /api/v1/send/audio` | 16 MB |
| Video | `POST /api/v1/send/video` | 16 MB |
| Location | `POST /api/v1/send/location` | — |
| Contact | `POST /api/v1/send/contact` | — |
| Reaction | `POST /api/v1/send/reaction` | — |
| Bulk | `POST /api/v1/send/bulk` | 500 recipients max |

## 10.4 Webhook System

### Webhook Events

| Event | Trigger | Payload |
|---|---|---|
| `message.received` | Incoming message | `{ from, message, timestamp, type }` |
| `message.sent` | Message delivered | `{ to, messageId, status, timestamp }` |
| `message.failed` | Send failed | `{ to, messageId, error, timestamp }` |
| `instance.connected` | WA connected | `{ instanceId, phoneNumber }` |
| `instance.disconnected` | WA disconnected | `{ instanceId, reason }` |
| `instance.qr` | QR code generated | `{ instanceId, qrData }` |

### Webhook Delivery

| Config | Value |
|---|---|
| Timeout | 10 seconds |
| Retry Attempts | 5 |
| Retry Backoff | Exponential: 10s, 30s, 90s, 270s, 810s |
| Signature | HMAC-SHA256 in `X-Wavo-Signature` header |
| Content-Type | `application/json` |
| Dead Letter | After 5 failures → store in DLQ, notify user |

## 10.5 Dashboard Features

### User Dashboard Pages

| Page | Features |
|---|---|
| Overview | Active instances, messages today, queue status, charts |
| WhatsApp Services | Instance list, create/delete, QR scan, status badges |
| Analytics | Messages sent/received chart, success rate, peak hours |
| API Keys | Create/revoke keys, usage stats, scopes |
| Logs | Filterable message logs, JSON viewer, export |
| Webhooks | Configure URLs, view delivery history, retry failed |
| Settings | Profile, password, notification preferences |

### Admin Dashboard Pages

| Page | Features |
|---|---|
| User Management | List users, change roles/plans, suspend accounts |
| System Analytics | Total messages, active instances, resource usage |
| Queue Monitoring | BullMQ dashboard, queue depth, processing rate |
| Worker Monitoring | Baileys worker health, session count per worker |
| Config Management | Rate limits, feature flags, system settings |

---

# 11. Database Architecture

## Design Principles (Mandatory)

- UUID v7 primary keys (time-sortable)
- Soft delete (`deletedAt`) on all user-facing models
- Audit columns (`createdAt`, `updatedAt`) on all models
- Indexed foreign keys
- JSONB metadata columns for extensibility
- TimescaleDB hypertables for time-series logs
- Read replica ready (no writes in read paths)
- PgBouncer for connection pooling (max 100 connections)

## Directory Structure

```
packages/database/
├── prisma/
│   ├── schema.prisma
│   ├── migrations/
│   └── seed.ts
├── src/
│   ├── client.ts        # Prisma client singleton
│   └── index.ts         # Barrel export
├── package.json
└── tsconfig.json
```

## Prisma Models

### User

```prisma
model User {
  id              String    @id @default(uuid())
  email           String    @unique
  passwordHash    String?
  fullName        String
  avatarUrl       String?
  role            UserRole  @default(USER)
  plan            UserPlan  @default(FREE)

  googleId        String?   @unique

  isActive        Boolean   @default(true)
  emailVerifiedAt DateTime?
  lastLoginAt     DateTime?

  services        WhatsAppService[]
  apiKeys         ApiKey[]
  sessions        Session[]
  auditLogs       AuditLog[]

  deletedAt       DateTime?
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt

  @@index([email])
  @@index([role, plan])
  @@index([deletedAt])
}

enum UserRole {
  SUPER_ADMIN
  ADMIN
  USER
}

enum UserPlan {
  FREE
  PRO
  BUSINESS
  ENTERPRISE
}
```

### Session (Auth)

```prisma
model Session {
  id              String   @id @default(uuid())
  userId          String
  user            User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  refreshTokenHash String  @unique
  tokenFamily      String
  userAgent        String?
  ipAddress        String?

  expiresAt       DateTime
  revokedAt       DateTime?

  createdAt       DateTime @default(now())

  @@index([userId])
  @@index([tokenFamily])
  @@index([expiresAt])
}
```

### WhatsAppService

```prisma
model WhatsAppService {
  id              String        @id @default(uuid())
  userId          String
  user            User          @relation(fields: [userId], references: [id], onDelete: Cascade)

  name            String
  slug            String        @unique
  status          ServiceStatus @default(INACTIVE)
  phoneNumber     String?

  sessionStoragePath String?    // MinIO/S3 path to encrypted session

  webhooks        WebhookConfig[]
  apiKeys         ApiKey[]
  messageLogs     MessageLog[]
  queueJobs       QueueJob[]

  dailyMessageCount Int        @default(0)
  dailyMessageResetAt DateTime?

  deletedAt       DateTime?
  createdAt       DateTime     @default(now())
  updatedAt       DateTime     @updatedAt

  @@index([userId])
  @@index([slug])
  @@index([status])
  @@index([deletedAt])
}

enum ServiceStatus {
  INACTIVE
  CONNECTING
  QR_PENDING
  CONNECTED
  DISCONNECTED
  SUSPENDED
}
```

### ApiKey

```prisma
model ApiKey {
  id            String   @id @default(uuid())
  userId        String
  user          User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  serviceId     String
  service       WhatsAppService @relation(fields: [serviceId], references: [id], onDelete: Cascade)

  name          String
  keyPrefix     String          // First 8 chars for identification: "wavo_abc"
  keyHash       String   @unique // SHA-256 hash of full key

  scopes        String[] @default(["send:message", "read:logs"])
  isActive      Boolean  @default(true)

  lastUsedAt    DateTime?
  expiresAt     DateTime?

  createdAt     DateTime @default(now())

  @@index([userId])
  @@index([serviceId])
  @@index([keyHash])
}
```

### WebhookConfig

```prisma
model WebhookConfig {
  id            String   @id @default(uuid())
  serviceId     String
  service       WhatsAppService @relation(fields: [serviceId], references: [id], onDelete: Cascade)

  url           String
  secret        String          // For HMAC-SHA256 signing
  events        String[]        // ["message.received", "message.sent", ...]
  isActive      Boolean  @default(true)

  deliveryLogs  WebhookDeliveryLog[]

  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  @@index([serviceId])
}
```

### WebhookDeliveryLog

```prisma
model WebhookDeliveryLog {
  id            BigInt   @id @default(autoincrement())
  webhookId     String
  webhook       WebhookConfig @relation(fields: [webhookId], references: [id], onDelete: Cascade)

  event         String
  payload       Json
  responseStatus Int?
  responseBody  String?
  duration      Int?            // ms

  status        DeliveryStatus  @default(PENDING)
  attempts      Int      @default(0)
  nextRetryAt   DateTime?
  lastError     String?

  createdAt     DateTime @default(now())

  @@index([webhookId])
  @@index([status])
  @@index([createdAt])
}

enum DeliveryStatus {
  PENDING
  SUCCESS
  FAILED
  DLQ
}
```

### MessageLog

```prisma
model MessageLog {
  id            BigInt          @id @default(autoincrement())
  serviceId     String
  service       WhatsAppService @relation(fields: [serviceId], references: [id], onDelete: Cascade)

  direction     MessageDirection
  messageType   MessageType
  toNumber      String
  fromNumber    String?

  status        MessageStatus
  errorMessage  String?

  payload       Json?           // Message content (JSONB)
  metadata      Json?           // Extra data (JSONB)

  queueJobId    String?         // Reference to BullMQ job
  webhookDeliveredAt DateTime?

  sentAt        DateTime?
  deliveredAt   DateTime?

  createdAt     DateTime @default(now())

  @@index([serviceId])
  @@index([status])
  @@index([createdAt])
  @@index([toNumber])
}

enum MessageDirection { INBOUND OUTBOUND }
enum MessageType { TEXT IMAGE DOCUMENT AUDIO VIDEO LOCATION CONTACT REACTION }
enum MessageStatus { QUEUED PROCESSING SENT DELIVERED READ FAILED }
```

### QueueJob

```prisma
model QueueJob {
  id            String   @id @default(uuid())
  serviceId     String
  service       WhatsAppService @relation(fields: [serviceId], references: [id], onDelete: Cascade)

  bullJobId     String   @unique
  queue         String            // "enterprise", "pro", "free", "bulk"
  type          String            // "send_message", "send_bulk", "send_media"

  status        JobStatus @default(WAITING)
  priority      Int       @default(0)

  payload       Json
  result        Json?
  errorMessage  String?

  attempts      Int       @default(0)
  maxAttempts   Int       @default(3)

  startedAt     DateTime?
  completedAt   DateTime?
  failedAt      DateTime?

  createdAt     DateTime  @default(now())

  @@index([serviceId])
  @@index([bullJobId])
  @@index([status])
  @@index([queue])
}

enum JobStatus { WAITING ACTIVE COMPLETED FAILED DLQ }
```

### AuditLog

```prisma
model AuditLog {
  id            BigInt   @id @default(autoincrement())
  userId        String?
  user          User?    @relation(fields: [userId], references: [id])

  action        String          // "user.created", "service.deleted", "apikey.revoked"
  resource      String          // "User", "WhatsAppService", "ApiKey"
  resourceId    String?
  details       Json?           // Changed fields, old/new values
  ipAddress     String?
  userAgent     String?

  createdAt     DateTime @default(now())

  @@index([userId])
  @@index([action])
  @@index([resource, resourceId])
  @@index([createdAt])
}
```

### SystemConfig

```prisma
model SystemConfig {
  id            String   @id @default(uuid())
  key           String   @unique    // "rate_limit.free.daily", "feature.bulk_send"
  value         Json                // Flexible value
  description   String?
  updatedBy     String?

  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  @@index([key])
}
```

---

# 12. API Specification

## Base URL
```
Production:  https://api.wavo.dev/api/v1
Development: http://localhost:4000/api/v1
```

## Authentication Header
```http
Authorization: Bearer wavo_sk_xxxxxxxxxxxxxxxxxxxx
Content-Type: application/json
X-Request-ID: <uuid>     // Optional, for tracing
```

## Standard Response Format

### Success
```json
{
  "success": true,
  "data": { ... },
  "meta": {
    "requestId": "uuid",
    "timestamp": "2026-05-17T12:00:00Z"
  }
}
```

### Error
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Human-readable error message",
    "details": [ { "field": "to", "message": "Invalid phone number format" } ]
  },
  "meta": {
    "requestId": "uuid",
    "timestamp": "2026-05-17T12:00:00Z"
  }
}
```

## Error Code Catalog

| HTTP | Code | Description |
|---|---|---|
| 400 | `VALIDATION_ERROR` | Invalid request body/params |
| 400 | `INVALID_PHONE_NUMBER` | Phone number not E.164 format |
| 401 | `UNAUTHORIZED` | Missing or invalid auth token |
| 401 | `TOKEN_EXPIRED` | JWT access token expired |
| 401 | `INVALID_API_KEY` | API key not found or inactive |
| 403 | `FORBIDDEN` | Insufficient permissions |
| 403 | `PLAN_LIMIT_EXCEEDED` | Plan quota exceeded |
| 404 | `NOT_FOUND` | Resource not found |
| 409 | `CONFLICT` | Resource already exists |
| 422 | `INSTANCE_NOT_CONNECTED` | WA instance not connected |
| 429 | `RATE_LIMIT_EXCEEDED` | Rate limit hit |
| 500 | `INTERNAL_ERROR` | Unexpected server error |
| 502 | `WHATSAPP_ERROR` | Baileys/WA protocol error |
| 503 | `SERVICE_UNAVAILABLE` | Service temporarily unavailable |

## Pagination (Cursor-Based)

```http
GET /api/v1/logs?cursor=eyJ...&limit=50&sort=desc
```

Response:
```json
{
  "data": [...],
  "pagination": {
    "cursor": "eyJ...",
    "nextCursor": "eyJ...",
    "hasMore": true,
    "limit": 50,
    "total": 1234
  }
}
```

## Endpoint Details

### Auth Endpoints

#### `POST /api/v1/auth/register`
```json
// Request
{ "email": "user@example.com", "password": "SecureP@ss1", "fullName": "John Doe" }

// Response 201
{ "success": true, "data": { "user": { "id": "uuid", "email": "...", "role": "USER", "plan": "FREE" }, "accessToken": "eyJ...", "refreshToken": "eyJ..." } }
```

#### `POST /api/v1/auth/login`
```json
// Request
{ "email": "user@example.com", "password": "SecureP@ss1" }

// Response 200
{ "success": true, "data": { "user": {...}, "accessToken": "eyJ...", "refreshToken": "eyJ..." } }
```

#### `POST /api/v1/auth/refresh`
```json
// Request
{ "refreshToken": "eyJ..." }

// Response 200 (new tokens, old refresh token invalidated)
{ "success": true, "data": { "accessToken": "eyJ...", "refreshToken": "eyJ..." } }
```

#### `POST /api/v1/auth/logout`
```json
// Request — revoke all sessions
{ "allDevices": false }

// Response 200
{ "success": true, "data": { "message": "Logged out successfully" } }
```

### Service Endpoints

#### `POST /api/v1/services`
```json
// Request
{ "name": "My Bot", "webhookUrl": "https://myapp.com/webhook" }

// Response 201
{ "success": true, "data": { "id": "uuid", "name": "My Bot", "slug": "my-bot-a1b2", "status": "INACTIVE" } }
```

#### `GET /api/v1/services`
```json
// Response 200
{ "success": true, "data": [ { "id": "uuid", "name": "My Bot", "status": "CONNECTED", "phoneNumber": "628xxx" } ] }
```

#### `POST /api/v1/services/:id/connect`
```json
// Response 200 — returns QR for scanning
{ "success": true, "data": { "qr": "base64_qr_data", "expiresIn": 60 } }
```

#### `POST /api/v1/services/:id/disconnect`
```json
// Response 200
{ "success": true, "data": { "message": "Service disconnected" } }
```

### Messaging Endpoints

#### `POST /api/v1/send/text`
```json
// Request
{
  "serviceId": "uuid",
  "to": "6281234567890",
  "message": "Hello from Wavo!",
  "options": {
    "typingDelay": true,
    "quotedMessageId": null
  }
}

// Response 202 (Accepted — queued)
{
  "success": true,
  "data": {
    "messageId": "uuid",
    "status": "QUEUED",
    "queuePosition": 5,
    "estimatedDelivery": "2026-05-17T12:00:05Z"
  }
}
```

#### `POST /api/v1/send/image`
```json
// Request (multipart/form-data)
{
  "serviceId": "uuid",
  "to": "6281234567890",
  "caption": "Check this out!",
  "image": "<file upload, max 16MB, jpg/png/webp>"
}
```

#### `POST /api/v1/send/bulk`
```json
// Request
{
  "serviceId": "uuid",
  "recipients": ["6281234567890", "6289876543210"],
  "message": "Broadcast message",
  "options": { "typingDelay": true, "interMessageDelay": 5 }
}

// Response 202
{
  "success": true,
  "data": {
    "batchId": "uuid",
    "totalRecipients": 2,
    "status": "QUEUED",
    "estimatedCompletion": "2026-05-17T12:01:00Z"
  }
}
```

### Log & Analytics Endpoints

#### `GET /api/v1/logs?serviceId=uuid&status=FAILED&cursor=xxx&limit=50`
#### `GET /api/v1/analytics?serviceId=uuid&from=2026-05-01&to=2026-05-17`
#### `GET /api/v1/webhooks/:id/deliveries?status=FAILED`

### Admin Endpoints

#### `GET /api/v1/admin/users?role=USER&plan=FREE&cursor=xxx`
#### `PATCH /api/v1/admin/users/:id` — Update role, plan, suspend
#### `GET /api/v1/admin/system/health` — System health check
#### `GET /api/v1/admin/queue/stats` — Queue depth, processing rate
#### `PUT /api/v1/admin/config/:key` — Update system config

---

# 13. WebSocket Events (Socket.IO)

## Connection

```javascript
const socket = io('wss://api.wavo.dev', {
  auth: { token: 'Bearer eyJ...' },
  transports: ['websocket']
});

socket.emit('subscribe', { serviceId: 'uuid' });
```

## Events

| Event | Direction | Payload |
|---|---|---|
| `service:qr` | Server → Client | `{ serviceId, qr: "base64", expiresIn: 60 }` |
| `service:status` | Server → Client | `{ serviceId, status: "CONNECTED", phoneNumber }` |
| `service:message` | Server → Client | `{ serviceId, from, message, type, timestamp }` |
| `service:log` | Server → Client | `{ serviceId, logEntry: {...} }` |
| `queue:update` | Server → Client | `{ queue, depth, processing, failed }` |
| `system:health` | Server → Client (admin) | `{ workers, redis, db, uptime }` |

---

# 14. Queue Architecture (BullMQ)

## Queue Configuration

| Queue | Concurrency | Rate Limit | Max Retries | Backoff |
|---|---|---|---|---|
| `enterprise` | 20 | 100/min | 5 | Exponential (base 5s, max 5min) |
| `pro` | 10 | 50/min | 3 | Exponential (base 10s, max 10min) |
| `free` | 3 | 10/min | 3 | Exponential (base 30s, max 30min) |
| `bulk` | 5 | 20/min | 3 | Exponential (base 60s, max 1hr) |
| `webhook` | 10 | 200/min | 5 | Exponential (base 10s, max 15min) |

## Job Lifecycle

```
WAITING → ACTIVE → COMPLETED
                  → FAILED → RETRY (up to maxRetries) → DLQ
```

## Dead Letter Queue (DLQ)

- Failed jobs after max retries → moved to `dlq:{queueName}`
- Admin dashboard shows DLQ count with manual retry option
- DLQ retention: 7 days, then auto-purge
- Alert: Slack/email notification when DLQ count > 10

## Idempotency

- Each API request can include `X-Idempotency-Key` header
- Keys stored in Redis with 24h TTL
- Duplicate requests return cached response

---

# 15. Redis Architecture

## Key Namespaces

| Namespace | Pattern | TTL | Purpose |
|---|---|---|---|
| Rate Limit | `rl:{userId}:{endpoint}` | 60s | Sliding window counters |
| Daily Quota | `quota:{userId}:{date}` | 24h | Daily message count |
| Session Cache | `session:{userId}` | 15min | JWT payload cache |
| QR Code | `qr:{serviceId}` | 60s | Temporary QR data |
| Idempotency | `idem:{key}` | 24h | Idempotency keys |
| WS Rooms | `ws:room:{serviceId}` | — | Socket.IO adapter |
| Lock | `lock:{resource}:{id}` | 30s | Distributed locks |
| Feature Flag | `ff:{flagName}` | 5min | Feature flag cache |

## Redis Configuration (Production)

```
Mode: Sentinel (3 nodes)
Max Memory: 2GB per node
Eviction Policy: allkeys-lru
Persistence: AOF (appendfsync everysec)
```

---

# 16. Error Handling & Resilience

## Circuit Breaker Pattern

| Service | Failure Threshold | Reset Timeout | Half-Open Requests |
|---|---|---|---|
| Baileys (WA) | 5 failures in 60s | 30s | 2 |
| PostgreSQL | 3 failures in 30s | 15s | 1 |
| Redis | 3 failures in 30s | 10s | 1 |
| Webhook Delivery | 10 failures in 60s | 60s | 3 |
| MinIO/S3 | 5 failures in 60s | 30s | 2 |

## Timeout Configuration

| Operation | Timeout |
|---|---|
| API request (total) | 30s |
| Database query | 10s |
| Redis command | 5s |
| Webhook delivery | 10s |
| File upload to MinIO | 60s |
| Baileys message send | 30s |
| QR code generation | 60s |

## Graceful Degradation

| Scenario | Behavior |
|---|---|
| Redis down | Fall back to in-memory rate limiting, disable caching, queue accepts but pauses processing |
| PostgreSQL slow | Return cached responses where possible, queue writes for retry |
| Baileys disconnected | Queue messages, auto-reconnect with exponential backoff |
| MinIO unavailable | Reject media uploads with 503, text messages still work |
| Worker crash | K8s auto-restart, BullMQ auto-reassigns stuck jobs after 5min |

## Graceful Shutdown Procedure

1. Stop accepting new HTTP connections
2. Finish processing in-flight requests (30s timeout)
3. Close WebSocket connections with `going_away` code
4. Stop BullMQ workers (wait for active jobs to complete, 60s max)
5. Close Baileys sessions gracefully
6. Flush Redis pipeline
7. Close database connections
8. Exit with code 0

---

# 17. Security Architecture

## Security Layers

| Layer | Implementation |
|---|---|
| Transport | TLS 1.3 (min TLS 1.2), HSTS |
| Authentication | JWT RS256, API key SHA-256 hash |
| Authorization | RBAC with plan-based limits |
| Encryption at Rest | AES-256-GCM for WA sessions |
| Input Validation | Zod schemas on all endpoints |
| Output Encoding | Auto-escaped by React/Next.js |
| Headers | CSP, X-Frame-Options, X-Content-Type-Options |
| CSRF | SameSite cookies + CSRF token |
| Rate Limiting | Redis sliding window |
| Secrets | Environment variables (Vault recommended for prod) |

## API Key Security

```
Format: wavo_sk_<32 random bytes base62>
Example: wavo_sk_a1B2c3D4e5F6g7H8i9J0k1L2m3N4o5P6

Storage:
  - Only hash (SHA-256) stored in DB
  - Full key shown once at creation
  - Prefix stored for identification
  - Scopes: ["send:message", "send:media", "read:logs", "manage:webhook"]
```

## OWASP Top 10 Mapping

| Risk | Mitigation |
|---|---|
| A01 Broken Access Control | RBAC + plan-based limits + ownership checks |
| A02 Cryptographic Failures | AES-256-GCM, bcrypt (cost 12), RS256 JWT |
| A03 Injection | Prisma ORM (parameterized), Zod validation |
| A04 Insecure Design | Threat modeling, security review in PR |
| A05 Security Misconfiguration | Hardened Docker images, security headers |
| A06 Vulnerable Components | `npm audit` in CI, Snyk/Dependabot |
| A07 Auth Failures | Refresh token rotation, brute-force protection |
| A08 Data Integrity | HMAC webhook signatures, idempotency keys |
| A09 Logging Failures | Structured audit logs, Sentry error tracking |
| A10 SSRF | Webhook URL validation (block private IPs) |

## Data Privacy

- Passwords: bcrypt with cost factor 12
- WA sessions: AES-256-GCM encrypted before storage
- API keys: SHA-256 hashed, never stored in plaintext
- Message content: encrypted at rest (PostgreSQL TDE or application-level)
- PII: can be purged via user deletion (soft delete → hard delete after 30 days)
- Logs: auto-purge after retention period

---

# 18. Observability & Monitoring

## Monitoring Stack

| Tool | Purpose | Retention |
|---|---|---|
| Prometheus | Metrics collection | 90 days |
| Grafana | Dashboards & alerting | — |
| Loki | Log aggregation | 30 days |
| OpenTelemetry | Distributed tracing | 7 days |
| Sentry | Error tracking & alerting | 90 days |

## Key Metrics

| Metric Name | Type | Labels |
|---|---|---|
| `wavo_api_request_duration_seconds` | Histogram | method, endpoint, status |
| `wavo_api_requests_total` | Counter | method, endpoint, status |
| `wavo_messages_sent_total` | Counter | service_id, type, status |
| `wavo_messages_failed_total` | Counter | service_id, error_code |
| `wavo_queue_depth` | Gauge | queue_name |
| `wavo_queue_job_duration_seconds` | Histogram | queue_name, job_type |
| `wavo_active_wa_sessions` | Gauge | worker_id |
| `wavo_wa_reconnects_total` | Counter | service_id |
| `wavo_webhook_delivery_duration_seconds` | Histogram | status |
| `wavo_db_query_duration_seconds` | Histogram | operation |
| `wavo_redis_commands_total` | Counter | command |

## Alerting Rules

| Alert | Condition | Severity | Channel |
|---|---|---|---|
| High API Latency | p95 > 1s for 5min | Warning | Slack |
| API Error Rate | 5xx > 5% for 3min | Critical | Slack + PagerDuty |
| Queue Backlog | Depth > 1000 for 10min | Warning | Slack |
| DLQ Growing | DLQ count > 10 | Warning | Slack + Email |
| WA Session Down | Instance disconnected > 5min | Critical | Slack |
| Worker Unhealthy | Health check failed 3x | Critical | PagerDuty |
| Redis Memory High | > 80% max memory | Warning | Slack |
| DB Connection Pool | > 90% utilized | Warning | Slack |
| Disk Space Low | > 85% used | Warning | Slack |
| Certificate Expiry | < 14 days | Warning | Email |

## Structured Logging Standard

```json
{
  "level": "info",
  "timestamp": "2026-05-17T12:00:00.000Z",
  "service": "api-server",
  "requestId": "uuid",
  "traceId": "uuid",
  "userId": "uuid",
  "message": "Message queued successfully",
  "data": { "messageId": "uuid", "queue": "pro" }
}
```

Log Levels: `trace` → `debug` → `info` → `warn` → `error` → `fatal`

---

# 19. Deployment & Infrastructure

## Development (Docker Compose)

```yaml
services:
  frontend:    # Next.js :3000
  api:         # Fastify :4000
  worker:      # Baileys worker
  postgres:    # PostgreSQL :5432
  redis:       # Redis :6379
  minio:       # MinIO :9000
  mailhog:     # Email testing :8025
```

## Production (Kubernetes)

### Minimum Resource Requirements

| Service | CPU Request | CPU Limit | Memory Request | Memory Limit | Replicas |
|---|---|---|---|---|---|
| Frontend | 250m | 500m | 256Mi | 512Mi | 2 |
| API Server | 500m | 1000m | 512Mi | 1Gi | 3 |
| Baileys Worker | 500m | 1000m | 1Gi | 2Gi | 2-10 (HPA) |
| Queue Worker | 250m | 500m | 512Mi | 1Gi | 2-5 (HPA) |
| PostgreSQL | 1000m | 2000m | 2Gi | 4Gi | 1+1 replica |
| Redis Sentinel | 500m | 1000m | 1Gi | 2Gi | 3 |
| PgBouncer | 100m | 250m | 128Mi | 256Mi | 2 |

### Auto-Scaling (HPA)

```yaml
# Baileys Worker HPA
minReplicas: 2
maxReplicas: 10
metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        averageUtilization: 70
  - type: Pods
    pods:
      metric:
        name: wavo_active_wa_sessions
      target:
        averageValue: 25    # Scale up when >25 sessions per worker
```

### Deployment Strategy

| Aspect | Strategy |
|---|---|
| Deployment | Rolling update (maxSurge: 1, maxUnavailable: 0) |
| Rollback | Automatic on failed health checks (3 consecutive) |
| Config Management | Helm charts + Kustomize overlays |
| Secrets | Kubernetes Secrets (HashiCorp Vault recommended) |
| Ingress | Nginx Ingress Controller with TLS |

### Database Migration (Zero-Downtime)

1. Apply backward-compatible migration (`prisma migrate deploy`)
2. Deploy new application version
3. Verify new version healthy
4. Apply breaking changes (if any) in next release cycle
5. Never rename/drop columns in the same release as code changes

### Backup & Disaster Recovery

| Resource | Backup Method | Schedule | Retention | RPO |
|---|---|---|---|---|
| PostgreSQL | pg_dump + WAL archiving | Every 6h + continuous WAL | 30 days | < 5 min |
| Redis | AOF + RDB snapshots | Continuous AOF, RDB every 1h | 7 days | < 1 min |
| MinIO | Cross-region replication | Continuous | 90 days | < 1 min |
| Kubernetes | Velero cluster backup | Daily | 14 days | < 24h |

### Health Check Endpoints

```
GET /healthz          → 200 OK (basic liveness)
GET /readyz           → 200 OK (ready to accept traffic)
GET /healthz/detailed → { db: "ok", redis: "ok", workers: 3 }
```

---

# 20. CI/CD Pipeline

## GitHub Actions Workflow

```
┌─────────────────────────────────────────────────┐
│  PR Created / Push to main                       │
└──────────────────┬──────────────────────────────┘
                   │
          ┌────────▼────────┐
          │  1. Lint & Type  │  eslint + tsc --noEmit
          │     Check        │  
          └────────┬────────┘
                   │
          ┌────────▼────────┐
          │  2. Unit Tests   │  vitest --coverage
          │                  │  Minimum 80% coverage
          └────────┬────────┘
                   │
          ┌────────▼────────┐
          │  3. Integration  │  supertest + testcontainers
          │     Tests        │  (PostgreSQL + Redis in Docker)
          └────────┬────────┘
                   │
          ┌────────▼────────┐
          │  4. Security     │  npm audit + Snyk scan
          │     Scan         │  
          └────────┬────────┘
                   │
          ┌────────▼────────┐
          │  5. Build        │  next build + tsc
          │                  │  
          └────────┬────────┘
                   │
          ┌────────▼────────┐
          │  6. Docker Build │  Multi-stage build
          │     & Push       │  → ghcr.io/wavo/...
          └────────┬────────┘
                   │ (main branch only)
          ┌────────▼────────┐
          │  7. Deploy       │  Helm upgrade --atomic
          │     Staging      │  → Run smoke tests
          └────────┬────────┘
                   │ (manual approval)
          ┌────────▼────────┐
          │  8. Deploy       │  Helm upgrade --atomic
          │     Production   │  → Monitor 15min
          └─────────────────┘
```

## Branch Strategy

| Branch | Purpose | Deploy Target |
|---|---|---|
| `main` | Production-ready code | Staging → Production |
| `develop` | Integration branch | Development |
| `feature/*` | Feature branches | PR preview (optional) |
| `hotfix/*` | Production fixes | Fast-track to production |

---

# 21. Testing Strategy

## Coverage Targets

| Type | Target | Tool |
|---|---|---|
| Unit Tests | ≥ 80% line coverage | Vitest |
| Integration Tests | ≥ 60% API coverage | Supertest + Testcontainers |
| E2E Tests | Critical paths only | Playwright |
| Load Tests | Baseline established | k6 |

## Critical Test Scenarios

### Happy Path
1. Register → Login → Create Service → Scan QR → Connected
2. Send Text Message → Queued → Sent → Webhook Delivered
3. Send Bulk → Jobs Created → Processed → All Delivered
4. API Key Create → Use Key → Send Message → Success

### Failure Path
5. Send to Invalid Number → Error Response → Log Created
6. Service Disconnected → Auto-Reconnect → Resume Queue
7. Rate Limit Hit → 429 Response → Retry After Header
8. Webhook Delivery Failed → Retry 5x → DLQ

### Edge Cases
9. Concurrent Send to Same Number → Deduplication
10. Session Expired During Send → Re-auth → Retry
11. Redis Down → Graceful Degradation
12. Bulk Send with 500 Recipients → Throttled Processing

## Load Testing Targets (k6)

| Scenario | Target | Duration |
|---|---|---|
| Steady State | 100 req/s, 50 WA sessions | 30 min |
| Spike Test | 0 → 500 req/s in 1min | 10 min |
| Soak Test | 50 req/s steady | 4 hours |
| Stress Test | Increase until failure | Until break |

## Mock Strategy

| External Service | Mock Method |
|---|---|
| WhatsApp (Baileys) | Custom mock implementing Baileys interface |
| MinIO/S3 | Testcontainers with MinIO image |
| PostgreSQL | Testcontainers with PostgreSQL image |
| Redis | Testcontainers with Redis image |
| SMTP | Mailhog in Docker |

---

# 22. Environment Variables

```env
# ═══════════════════════════════════════════
# DATABASE
# ═══════════════════════════════════════════
DATABASE_URL=postgresql://user:pass@localhost:5432/wavo
DATABASE_POOL_SIZE=20
DATABASE_READ_REPLICA_URL=           # Optional

# ═══════════════════════════════════════════
# REDIS
# ═══════════════════════════════════════════
REDIS_URL=redis://localhost:6379
REDIS_SENTINEL_HOSTS=                # Production: host1:26379,host2:26379
REDIS_SENTINEL_NAME=mymaster         # Production sentinel name

# ═══════════════════════════════════════════
# AUTH & SECURITY
# ═══════════════════════════════════════════
JWT_PRIVATE_KEY=                      # RS256 private key (PEM)
JWT_PUBLIC_KEY=                       # RS256 public key (PEM)
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d
ENCRYPTION_KEY=                       # AES-256 key for session encryption
BCRYPT_ROUNDS=12

# ═══════════════════════════════════════════
# GOOGLE OAUTH
# ═══════════════════════════════════════════
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_CALLBACK_URL=

# ═══════════════════════════════════════════
# OBJECT STORAGE
# ═══════════════════════════════════════════
MINIO_ENDPOINT=localhost
MINIO_PORT=9000
MINIO_ACCESS_KEY=
MINIO_SECRET_KEY=
MINIO_BUCKET=wavo-storage
MINIO_USE_SSL=false                   # true in production

# ═══════════════════════════════════════════
# EMAIL (SMTP)
# ═══════════════════════════════════════════
SMTP_HOST=
SMTP_PORT=587
SMTP_USER=
SMTP_PASS=
SMTP_FROM=noreply@wavo.dev

# ═══════════════════════════════════════════
# OBSERVABILITY
# ═══════════════════════════════════════════
SENTRY_DSN=
OTEL_EXPORTER_OTLP_ENDPOINT=
LOG_LEVEL=info                        # trace|debug|info|warn|error|fatal

# ═══════════════════════════════════════════
# APPLICATION
# ═══════════════════════════════════════════
NODE_ENV=production
PORT=4000
FRONTEND_URL=https://app.wavo.dev
API_URL=https://api.wavo.dev
ADMIN_EMAIL=admin@wavo.dev
```

---

# 23. Frontend Design System

## Design References
- Supabase (developer dashboard)
- Vercel (minimal, clean)
- Linear (smooth animations)
- Railway (dark mode aesthetic)
- Resend (API-focused UI)

## Color Palette

| Token | Light | Dark | Usage |
|---|---|---|---|
| `--primary` | `#10B981` (Emerald) | `#34D399` | Buttons, links, active |
| `--primary-hover` | `#059669` | `#6EE7B7` | Hover states |
| `--accent` | `#6366F1` (Indigo) | `#818CF8` | Secondary actions |
| `--bg` | `#FFFFFF` | `#09090B` (Zinc 950) | Page background |
| `--bg-card` | `#F4F4F5` (Zinc 100) | `#18181B` (Zinc 900) | Card background |
| `--bg-elevated` | `#E4E4E7` (Zinc 200) | `#27272A` (Zinc 800) | Elevated surfaces |
| `--text` | `#09090B` | `#FAFAFA` | Primary text |
| `--text-muted` | `#71717A` | `#A1A1AA` | Secondary text |
| `--border` | `#E4E4E7` | `#27272A` | Borders |
| `--success` | `#22C55E` | `#4ADE80` | Success states |
| `--warning` | `#F59E0B` | `#FBBF24` | Warning states |
| `--error` | `#EF4444` | `#F87171` | Error states |

## Typography

| Element | Font | Size | Weight |
|---|---|---|---|
| H1 | Inter | 32px / 2rem | 700 (Bold) |
| H2 | Inter | 24px / 1.5rem | 600 (Semibold) |
| H3 | Inter | 20px / 1.25rem | 600 |
| Body | Inter | 14px / 0.875rem | 400 (Regular) |
| Small | Inter | 12px / 0.75rem | 400 |
| Code | JetBrains Mono | 13px / 0.8125rem | 400 |

## Component Library (shadcn/ui)

| Component | Usage |
|---|---|
| Card | Dashboard metrics, service cards |
| Table | Logs, users, API keys |
| Dialog | Confirmations, QR scanner |
| Toast | Success/error notifications |
| Skeleton | Loading states |
| Badge | Status indicators |
| Command | Keyboard shortcuts |
| Sheet | Mobile navigation |
| Tabs | Settings, analytics views |
| Chart (Recharts) | Analytics, usage graphs |

## Animation Standards (Framer Motion)

| Animation | Duration | Easing |
|---|---|---|
| Page transition | 300ms | `easeInOut` |
| Card hover | 150ms | `easeOut` |
| Modal enter | 200ms | `spring(stiffness: 300)` |
| Toast appear | 200ms | `easeOut` |
| Skeleton pulse | 1.5s loop | `linear` |

---

# 24. Frontend Pages

## Public Pages

| Page | Route | Features |
|---|---|---|
| Landing | `/` | Hero, features, pricing, CTA |
| Pricing | `/pricing` | Plan comparison, FAQ |
| Docs | `/docs` | API reference, guides (MDX) |
| Login | `/login` | Email + Google OAuth |
| Register | `/register` | Email + Google OAuth |

## User Dashboard

| Page | Route | Features |
|---|---|---|
| Overview | `/dashboard` | Stats cards, charts, recent activity |
| Services | `/whatsapp-services` | Instance list, create, QR scan, status |
| Service Detail | `/whatsapp-services/:id` | Instance config, analytics, logs |
| Analytics | `/dashboard/analytics` | Message charts, success rates |
| API Keys | `/dashboard/api-keys` | Create, revoke, scopes, usage |
| Logs | `/logs` | Filterable table, JSON viewer, export |
| Webhooks | `/webhooks` | Config URLs, delivery history, retry |
| Settings | `/settings` | Profile, password, notifications |

## Admin Dashboard

| Page | Route | Features |
|---|---|---|
| Admin Overview | `/admin` | System stats, health |
| Users | `/admin/users` | List, roles, plans, suspend |
| Queue Monitor | `/admin/queues` | BullMQ dashboard, DLQ |
| Workers | `/admin/workers` | Health, sessions per worker |
| System Config | `/admin/config` | Feature flags, rate limits |

---

# 25. Production Readiness Checklist

## Infrastructure ✅

- [ ] Horizontal scaling configured (HPA)
- [ ] Health check endpoints (`/healthz`, `/readyz`)
- [ ] Graceful shutdown implemented
- [ ] Resource limits set on all pods
- [ ] PgBouncer connection pooling
- [ ] Redis Sentinel (3 nodes)
- [ ] TLS 1.3 on all endpoints
- [ ] Ingress with rate limiting

## Application ✅

- [ ] Queue retry with exponential backoff
- [ ] Dead letter queue processing
- [ ] Circuit breakers on all external calls
- [ ] Idempotency key support
- [ ] Structured JSON logging (Pino)
- [ ] Request ID propagation
- [ ] API versioning (`/api/v1/`)
- [ ] Input validation on all endpoints (Zod)
- [ ] Error catalog with consistent codes

## Security ✅

- [ ] JWT refresh token rotation
- [ ] API key hashing (SHA-256)
- [ ] AES-256-GCM session encryption
- [ ] OWASP Top 10 mitigations
- [ ] CSP + security headers
- [ ] Rate limiting per endpoint per plan
- [ ] Webhook URL validation (block private IPs)
- [ ] npm audit clean in CI

## Observability ✅

- [ ] Prometheus metrics endpoint (`/metrics`)
- [ ] Grafana dashboards provisioned
- [ ] Alert rules configured
- [ ] Structured logging to Loki
- [ ] Distributed tracing (OpenTelemetry)
- [ ] Sentry error tracking
- [ ] Audit log for admin actions

## Data ✅

- [ ] Database backups (6h schedule + WAL)
- [ ] Backup restoration tested
- [ ] Data retention policies implemented
- [ ] Soft delete on user-facing models
- [ ] Zero-downtime migration strategy
- [ ] Read replica configured

## Operations ✅

- [ ] Runbook documented
- [ ] Incident response procedure defined
- [ ] On-call rotation set up
- [ ] Secret rotation procedure
- [ ] Rollback procedure tested
- [ ] Load test baseline established

---

# 26. Open Source Governance

## Required Files

| File | Purpose |
|---|---|
| `README.md` | Project overview, quick start, badges |
| `CONTRIBUTING.md` | How to contribute, PR process, code style |
| `SECURITY.md` | Responsible disclosure process |
| `CODE_OF_CONDUCT.md` | Community standards |
| `CHANGELOG.md` | Version history (auto-generated) |
| `LICENSE` | MIT License |

## Repository Standards

- Semantic versioning (`MAJOR.MINOR.PATCH`)
- Conventional commits (`feat:`, `fix:`, `docs:`, `chore:`)
- PR template with checklist
- Issue templates (bug, feature, question)
- GitHub Actions CI/CD
- Branch protection on `main` (require reviews, passing CI)
- Dependabot / Renovate for dependency updates

---

# 27. Implementation Milestones

## Phase 1: Foundation (Weeks 1-4)
- [x] Monorepo setup (apps/engine, apps/landing)
- [x] Frontend dashboard shell (Next.js + shadcn/ui)
- [x] Landing page
- [ ] Prisma schema + migrations
- [ ] Fastify API server scaffold
- [ ] Auth system (JWT + Google OAuth)

## Phase 2: Core Engine (Weeks 5-8)
- [ ] Baileys integration (connect, send, receive)
- [ ] Multi-instance support
- [ ] Session persistence (MinIO)
- [ ] QR code authentication flow
- [ ] Redis + BullMQ queue setup

## Phase 3: API & Dashboard (Weeks 9-12)
- [ ] Full REST API implementation
- [ ] Webhook system (config + delivery)
- [ ] Dashboard: Services, Logs, Analytics
- [ ] Admin panel
- [ ] API key management

## Phase 4: Production Hardening (Weeks 13-16)
- [ ] Anti-ban engine
- [ ] Rate limiting (per plan)
- [ ] Circuit breakers + error handling
- [ ] Observability stack (Prometheus, Grafana, Loki)
- [ ] Docker Compose (dev) + Kubernetes (prod)

## Phase 5: Launch (Weeks 17-18)
- [ ] Security audit
- [ ] Load testing + optimization
- [ ] Documentation (API docs, guides)
- [ ] Open source release (README, CONTRIBUTING, etc.)
- [ ] Community launch

---

# 28. Roadmap (Post-Launch)

## v2.0 — Collaboration
- Team workspaces with shared instances
- Role-based access control (RBAC) within teams
- Conversation inbox (chat UI)
- AI-powered auto-replies

## v3.0 — Scale
- Multi-region worker deployment
- Plugin marketplace (custom message handlers)
- Official SDKs (Node.js, Python, PHP, Go)
- Auto-scaling based on message volume
- Chatwoot / Typebot integration

---

# 29. License

MIT License — Core platform free and open source forever.

---

# 30. Disclaimer

Wavo menggunakan WhatsApp Web protocol unofficial melalui Baileys library.

Penggunaan platform sepenuhnya menjadi tanggung jawab pengguna sesuai dengan WhatsApp Terms of Service. Wavo tidak berafiliasi dengan, didukung oleh, atau disponsori oleh WhatsApp Inc. atau Meta Platforms Inc.

---

*End of Production PRD v3.0*
