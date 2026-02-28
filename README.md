# DeTrust

> Decentralized Trust & Capability Scoring System for Freelancers

A transparent, secure, and equitable freelance marketplace powered by blockchain technology and AI.

---

## 🎯 Project Overview

DeTrust is a decentralized web application (DApp) designed to solve systemic issues in current freelance platforms:

| Problem | DeTrust Solution |
|---------|------------------|
| High fees (15-20%) | Smart contract escrow with 1-3% fees |
| Payment delays/non-payment | Automated escrow release on approval |
| Cold-start problem for newcomers | AI-powered capability assessment |
| Opaque reputation systems | Transparent, on-chain trust scores |
| Slow dispute resolution | Decentralized community arbitration |

---

## 🏗 Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENTS                                 │
│              (Web Browser + Crypto Wallet)                      │
└─────────────────────────┬───────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────────┐
│                    FRONTEND (Next.js 15)                        │
│                      apps/web                                   │
│  • Server Components + Client Components                        │
│  • Wallet Integration (wagmi + RainbowKit)                      │
│  • Real-time updates (Socket.io client)                         │
└─────────────────────────┬───────────────────────────────────────┘
                          │ HTTP/WebSocket
                          ▼
┌─────────────────────────────────────────────────────────────────┐
│                   BACKEND API (Express.js)                      │
│                        apps/api                                 │
│  • RESTful API endpoints                                        │
│  • JWT + SIWE Authentication                                    │
│  • Business logic & validation                                  │
│  • Background jobs (BullMQ)                                     │
│  • Real-time events (Socket.io)                                 │
└───────┬─────────────────┬─────────────────┬─────────────────────┘
        │                 │                 │
        ▼                 ▼                 ▼
┌───────────────┐ ┌───────────────┐ ┌───────────────────────────┐
│  PostgreSQL   │ │     Redis     │ │      AI Service           │
│  (Primary DB) │ │ (Cache/Queue) │ │   (Python FastAPI)        │
│               │ │               │ │   apps/ai-service         │
└───────────────┘ └───────────────┘ └───────────────────────────┘
        │
        ▼
┌─────────────────────────────────────────────────────────────────┐
│                    BLOCKCHAIN LAYER                             │
│                  packages/contracts                             │
│  • JobEscrow.sol - Payment escrow                               │
│  • ReputationRegistry.sol - On-chain reviews                    │
│  • DisputeResolution.sol - Decentralized arbitration            │
│                                                                 │
│  Network: Hardhat (local) → Polygon (production)                │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📁 Project Structure

```
detrust/
├── apps/
│   ├── web/              # Next.js 15 Frontend
│   ├── api/              # Node.js/Express Backend
│   └── ai-service/       # Python FastAPI AI Service
│
├── packages/
│   ├── contracts/        # Solidity Smart Contracts
│   ├── database/         # Prisma Schema & Client
│   ├── types/            # Shared TypeScript Types
│   └── config/           # Shared Configurations
│
├── docs/                 # Documentation
└── scripts/              # Utility Scripts
```

---

## 🛠 Tech Stack

### Frontend (`apps/web`)
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **State**: Zustand + TanStack Query
- **Web3**: wagmi v2 + viem + RainbowKit
- **Forms**: React Hook Form + Zod

### Backend (`apps/api`)
- **Runtime**: Node.js 20+
- **Framework**: Express.js
- **Language**: TypeScript
- **ORM**: Prisma
- **Validation**: Zod
- **Auth**: JWT + SIWE (Sign-In with Ethereum)
- **Real-time**: Socket.io
- **Queue**: BullMQ + Redis

### AI Service (`apps/ai-service`)
- **Runtime**: Python 3.11+
- **Framework**: FastAPI
- **ML**: scikit-learn
- **Validation**: Pydantic

### Blockchain (`packages/contracts`)
- **Language**: Solidity 
- **Framework**: Hardhat
- **Libraries**: OpenZeppelin
- **Network**: Hardhat (dev) / Polygon (prod)

### Infrastructure
- **Database**: PostgreSQL 17
- **Cache**: Redis 7
- **Storage**: IPFS (Pinata)
- **Monorepo**: Turborepo + pnpm

---

## 🚀 Quick Start

```bash
# 1. Install dependencies
pnpm install

# 2. Start PostgreSQL + Redis via Docker
docker-compose up -d postgres redis
docker-compose ps

# 3. Setup database
pnpm db:generate
pnpm db:push

# 4. Compile contracts
pnpm contracts:compile

# 5. Start Hardhat node (Terminal 1)
cd packages/contracts && pnpm node

# 6. Deploy contracts (Terminal 2)
pnpm contracts:deploy:local

# 7. Start development (Terminal 3)
pnpm dev
```

---

## 📚 Documentation

- [Setup Guide](docs/SETUP.md)
- [API Documentation](docs/API.md)
- [Architecture](docs/architecture/README.md)
- [Smart Contracts](docs/contracts/README.md)
- [Deployment](docs/DEPLOYMENT.md)

---

## 👥 Team

- **Haseeb Ahmad Khalil** - CIIT/FA22-BCS-027/ISB

**Supervisor**: Dr. Tehsin Kanwal

**Institution**: COMSATS University, Islamabad
