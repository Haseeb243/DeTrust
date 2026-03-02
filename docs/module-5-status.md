# Module 5: Dispute Resolution — Implementation Status

**Updated:** 2026-03-02

---

## Overview

Module 5 implements a **hybrid admin + user dispute resolution** system. Since there are no active platform jurors yet, disputes are resolved either by admin direct resolution or through a voting mechanism where admins and qualified users (trust score > 50) cast weighted votes.

### Architecture

```
User → Create Dispute → OPEN → Admin reviews evidence
                                ├── Admin resolves directly → RESOLVED
                                └── Admin starts voting → VOTING → Votes tallied → RESOLVED
```

---

## SRS Requirements

| SRS ID | Requirement | Status | Implementation Details |
|--------|-------------|--------|----------------------|
| **FE-1** | Dispute launch with evidence upload to IPFS | ✅ **Complete** | `DisputeForm` component + `dispute.service.ts` create flow with evidence URLs |
| **FE-2** | Juror selection based on reputation scores | ⚠️ **Hybrid** | Admin-first model; juror eligibility check (trust > 50) in vote casting |
| **FE-3** | Voting smart contract for juror decisions | ⚠️ **Partial** | `DisputeResolution.sol` exists on Hardhat; backend API voting implemented, smart contract integration pending |

---

## Backend Implementation

### Files

| File | Status | Description |
|------|--------|-------------|
| `apps/api/src/services/dispute.service.ts` | ✅ Complete | Core service: create, evidence, voting, admin resolve, list/get |
| `apps/api/src/controllers/dispute.controller.ts` | ✅ Complete | Express request handlers |
| `apps/api/src/routes/dispute.routes.ts` | ✅ Complete | RESTful endpoints with auth + validation |
| `apps/api/src/validators/dispute.validator.ts` | ✅ Complete | Zod schemas for all inputs |
| `apps/api/src/events/dispute.events.ts` | ✅ Complete | Socket.IO events for real-time updates |

### API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/api/disputes` | User/Admin | List disputes (own for users, all for admin) |
| `GET` | `/api/disputes/:id` | User | Get dispute detail |
| `GET` | `/api/disputes/:id/eligibility` | User | Check juror eligibility (M4-I5) |
| `POST` | `/api/disputes` | User | Create a new dispute |
| `POST` | `/api/disputes/:id/evidence` | User | Submit additional evidence |
| `POST` | `/api/disputes/:id/start-voting` | Admin | Move dispute to VOTING phase |
| `POST` | `/api/disputes/:id/vote` | User/Admin | Cast a weighted vote (trust score >= 50 for non-admin) |
| `POST` | `/api/disputes/:id/resolve` | Admin | Directly resolve a dispute |

### Dispute Lifecycle

```
OPEN → VOTING → RESOLVED
  │                ↑
  └── (admin resolve) ──┘
```

- **OPEN**: Dispute created, parties can submit evidence
- **VOTING**: Admin starts voting, 7-day deadline, weighted votes
- **RESOLVED**: Outcome determined (CLIENT_WINS, FREELANCER_WINS, SPLIT)

### Business Rules Enforced

- Only contract parties can initiate disputes (client or freelancer)
- Disputes only on ACTIVE contracts
- One active dispute per contract at a time
- Contract parties cannot vote on their own dispute
- **Juror eligibility**: Non-admin voters must have trust score >= 50 (M4-I5)
- Admin has vote weight of 10; users weighted by trust score / 10
- 7-day voting deadline (SRS)
- Admin cannot overturn jury but can resolve directly (hybrid model)

---

## Frontend Implementation

### Files

| File | Status | Description |
|------|--------|-------------|
| `apps/web/src/app/(dashboard)/disputes/page.tsx` | ✅ Complete | Dispute list with status tabs |
| `apps/web/src/app/(dashboard)/disputes/[id]/page.tsx` | ✅ Complete | Dispute detail with voting/admin actions |
| `apps/web/src/lib/api/dispute.ts` | ✅ Complete | API client module |
| `apps/web/src/hooks/queries/use-disputes.ts` | ✅ Complete | TanStack Query hooks |
| `apps/web/src/components/contracts/dispute-form.tsx` | ✅ Complete | Dispute creation form (pre-existing) |

### Pages

- **`/disputes`** — Lists all disputes with status tabs (All, Open, Voting, Resolved)
- **`/disputes/:id`** — Dispute detail page with:
  - Contract info, parties, evidence display
  - Vote tallies and individual vote listing
  - Voting UI for eligible voters during VOTING phase
  - Admin actions: start voting, direct resolution
  - Resolution display for completed disputes

### UI/UX

- Dark mode: Full support via `dt-*` semantic tokens
- Status badges: Color-coded (yellow=Open, blue=Voting, green=Resolved, red=Appealed)
- Responsive layout on all screen sizes
- Sidebar navigation: "Disputes" added for FREELANCER, CLIENT, and ADMIN roles
- Real-time updates via Socket.IO events

---

## Smart Contract (Pre-existing)

- `DisputeResolution.sol` — Full dispute lifecycle on Hardhat local node
- Functions: `openDispute()`, `submitVote()`, `resolveDispute()`
- **Integration status**: Backend API complete, smart contract calls not yet wired (Phase 4)

---

## What's Left

| Item | Priority | Details |
|------|----------|---------|
| Smart contract integration | HIGH | Wire `DisputeResolution.sol` calls to backend service |
| Evidence IPFS upload | MEDIUM | Upload evidence files to IPFS via ipfsService (currently URLs) |
| Juror selection algorithm | MEDIUM | Auto-select qualified jurors when voting starts |
| Dispute notifications | ✅ Done | DISPUTE_OPENED, DISPUTE_VOTING, DISPUTE_RESOLVED to both parties |
| Juror eligibility enforcement | ✅ Done | Trust score >= 50 required, eligibility API + frontend banner |
| Dispute history/archive | LOW | View past disputes with full details |

---

## Database Models

### Dispute

| Field | Type | Description |
|-------|------|-------------|
| `id` | String (CUID) | Primary key |
| `contractId` | String | FK to Contract |
| `initiatorId` | String | FK to User |
| `reason` | String | Dispute reason |
| `description` | Text | Detailed description |
| `evidence` | String[] | Array of evidence URLs/IPFS hashes |
| `status` | DisputeStatus | OPEN, VOTING, RESOLVED, APPEALED |
| `outcome` | DisputeOutcome | PENDING, CLIENT_WINS, FREELANCER_WINS, SPLIT |
| `resolution` | Text? | Admin resolution text |
| `clientVotes` | Int | Weighted vote tally for client |
| `freelancerVotes` | Int | Weighted vote tally for freelancer |
| `votingDeadline` | DateTime? | Voting deadline (7 days from start) |
| `resolvedAt` | DateTime? | When dispute was resolved |

### DisputeVote

| Field | Type | Description |
|-------|------|-------------|
| `id` | String (CUID) | Primary key |
| `disputeId` | String | FK to Dispute |
| `jurorId` | String | FK to User |
| `vote` | DisputeOutcome | CLIENT_WINS or FREELANCER_WINS |
| `weight` | Int | Vote weight based on trust score |
| `reasoning` | Text? | Optional reasoning |
| `@@unique` | `[disputeId, jurorId]` | One vote per juror per dispute |
