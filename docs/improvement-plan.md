# DeTrust — Improvement Plan (All Modules)

**Created:** 2026-02-28

This document outlines recommended improvements across all implemented modules, prioritized by severity and impact. Items are organized by module, with cross-cutting improvements listed separately.

> **Note:** Module 6 (AI Capability Prediction) is **deferred** to a future phase. All M6 items have been removed from the roadmap. The Python AI service scaffolding remains in the repo for future use.
>
> **Blockchain:** All smart contracts use **Hardhat local node** (chain 31337). Production blockchain deployment is not planned for the current phase.

---

## Module 1: Client & Freelancer Web App

| Priority | ID | Improvement | Status | Details |
|----------|----|-------------|--------|---------|
| HIGH | M1-I1 | PPR / cacheComponents for dashboard pages | ❌ Pending | Dashboard pages still use `'use client'`; convert to Server Components with `use cache` directives for faster TTFB |
| MEDIUM | M1-I3 | Offline/PWA support | ❌ Pending | Add service worker for offline dashboard access and push notifications |
| LOW | M1-I6 | Session refresh UX | ✅ Done | 401 auto-retry with deduplication already implemented (H-4) |

---

## Module 2: Smart Contract Job Board

| Priority | ID | Improvement | Status | Details |
|----------|----|-------------|--------|---------|
| HIGH | M2-I1 | Escrow integration with smart contract calls | ⚠️ Partial | `JobEscrow.sol` deployed on Hardhat local node; frontend wagmi `useWriteContract` calls need verification |
| HIGH | M2-I2 | Job listing blockchain anchoring | ❌ Pending | Job hashes should be stored on-chain for tamper-proof job records |
| MEDIUM | M2-I3 | Advanced job search (semantic / AI-powered) | ❌ Pending | Current search is keyword-based; integrate AI service for skill-matching recommendations |
| MEDIUM | M2-I4 | Proposal comparison view for clients | ❌ Pending | Side-by-side comparison of top proposals with trust scores and AI capability badges |
| MEDIUM | M2-I5 | Milestone payment automation | ⚠️ Partial | Auto-approve implemented (7-day cron), but auto-release via smart contract not wired |
| LOW | M2-I6 | Job templates for recurring projects | ❌ Pending | Allow clients to save and reuse job templates |
| LOW | M2-I7 | Bulk milestone management | ❌ Pending | Enable batch approval/rejection of milestones |

---

## Module 3: Review & Feedback System

| Priority | ID | Improvement | Status | Details |
|----------|----|-------------|--------|---------|
| **CRITICAL** | M3-I1 | Implement IPFS service for review content storage | ✅ **Done** | `ipfs.service.ts` now uploads review content to IPFS and returns CID hash |
| **CRITICAL** | M3-I2 | Implement blockchain service for on-chain hash recording | ✅ **Done** | `blockchain.service.ts` calls `ReputationRegistry.recordFeedback()` |
| **CRITICAL** | M3-I3 | Wire IPFS + blockchain into review submission flow | ✅ **Done** | `reviewService.submitReview()` now uploads to IPFS, records on-chain, and stores hashes in DB |
| HIGH | M3-I4 | Blockchain retry job for failed transactions | ✅ **Done** | `blockchain.job.ts` retries reviews with missing blockchain tx hashes |
| HIGH | M3-I5 | Frontend blockchain verification badge | ⚠️ Partial | Badge exists in `ReviewList` but only shows when `blockchainTxHash` is present (now populated) |
| MEDIUM | M3-I6 | Review response / rebuttal mechanism | ❌ Pending | Allow reviewed party to add a one-time response (stored separately, also immutable) |
| MEDIUM | M3-I7 | Review analytics dashboard | ❌ Pending | Trends in review scores over time, category comparison charts |
| LOW | M3-I8 | Review export to PDF | ❌ Pending | Allow users to export their review history as a PDF report |
| LOW | M3-I9 | Review search and filtering | ❌ Pending | Search reviews by keyword, filter by rating, date range |

---

## Module 4: Trust Scoring Module

| Priority | ID | Improvement | Status | Details |
|----------|----|-------------|--------|---------|
| **CRITICAL** | M4-I1 | Trust score history tracking (Prisma model) | ✅ **Done** | `TrustScoreHistory` model added with time-series data |
| **CRITICAL** | M4-I2 | Background recalculation job | ✅ **Done** | `trustScore.job.ts` runs daily to recalculate all user trust scores |
| HIGH | M4-I3 | Trust score trend API endpoint | ✅ **Done** | `GET /api/users/:id/trust-score/history` returns historical trend data |
| HIGH | M4-I4 | Frontend trend visualization | ❌ Pending | Line chart component for trust score history (requires charting library) |
| MEDIUM | M4-I5 | Juror eligibility enforcement | ❌ Pending | Check trust score > 50 in dispute voting flow (Module 5 dependency) |
| MEDIUM | M4-I6 | Trust score decay for inactivity | ❌ Pending | Gradually reduce scores for users inactive > 90 days |
| MEDIUM | M4-I7 | Weighted recency in ratings | ❌ Pending | Recent reviews should have higher weight than older ones |
| LOW | M4-I8 | Trust score notifications | ❌ Pending | Notify users when score crosses thresholds (50, 75) |
| LOW | M4-I9 | On-chain trust score anchoring | ❌ Pending | Periodically anchor score hashes to ReputationRegistry for decentralized proof |
| LOW | M4-I10 | Comparative trust analytics | ❌ Pending | Show user's score relative to platform average and percentile |

---

## Module 5: Dispute Resolution

| Priority | ID | Improvement | Status | Details |
|----------|----|-------------|--------|---------|
| **CRITICAL** | M5-I1 | Dispute service backend (create, evidence, lifecycle) | ❌ Pending | Implement `dispute.service.ts` — create dispute, submit evidence, manage OPEN→VOTING→RESOLVED lifecycle |
| **CRITICAL** | M5-I2 | Dispute API routes + controller | ❌ Pending | Implement `dispute.routes.ts` + `dispute.controller.ts` with RESTful endpoints |
| **CRITICAL** | M5-I3 | Evidence upload to IPFS | ❌ Pending | Wire evidence files through `ipfsService` for immutable storage |
| **CRITICAL** | M5-I4 | Juror selection algorithm | ❌ Pending | Select jurors with trust score > 50 and no prior work with either party |
| HIGH | M5-I5 | Juror voting frontend | ❌ Pending | UI for jurors to review evidence and cast trust-weighted votes |
| HIGH | M5-I6 | DisputeResolution.sol integration | ❌ Pending | Connect existing smart contract voting functions to backend API |
| HIGH | M5-I7 | Dispute dashboard page | ❌ Pending | List active disputes, status tracking, voting deadlines |
| MEDIUM | M5-I8 | Dispute notifications | ❌ Pending | Notify parties and jurors at each dispute lifecycle stage |
| MEDIUM | M5-I9 | Dispute history/archive | ❌ Pending | View past disputes with outcomes and evidence |

---

## Module 6: AI Capability Prediction System — 🔜 DEFERRED

> Module 6 is deferred to a future phase. The Python AI service scaffolding (`apps/ai-service/`) and `aiCapabilityScore` database field remain for future implementation. No active improvement items.

---

## Module 7: Admin Dashboard

| Priority | ID | Improvement | Status | Details |
|----------|----|-------------|--------|---------|
| **CRITICAL** | M7-I1 | Admin service + analytics | ❌ Pending | User counts, job stats, dispute rates, revenue metrics, platform health |
| **CRITICAL** | M7-I2 | Admin API routes + controller | ❌ Pending | Implement `admin.routes.ts` + `admin.controller.ts` |
| **CRITICAL** | M7-I3 | Admin dashboard page | ❌ Pending | Main analytics overview page with charts and key metrics |
| HIGH | M7-I4 | User management | ❌ Pending | View, suspend, flag users; search by role/status |
| HIGH | M7-I5 | Dispute monitoring | ❌ Pending | List all disputes, override stale disputes, review evidence |
| MEDIUM | M7-I6 | Smart contract parameter config | ❌ Pending | Update platform fee, pause/unpause contracts via admin interface |
| MEDIUM | M7-I7 | Flagged account auto-detection | ❌ Pending | Auto-flag based on dispute rate, low trust score, suspicious patterns |

---

## Module 8: Notifications & Communication

| Priority | ID | Improvement | Status | Details |
|----------|----|-------------|--------|---------|
| **CRITICAL** | M8-I1 | Messaging service backend | ❌ Pending | Implement `message.service.ts` — send/receive, conversation threads |
| **CRITICAL** | M8-I2 | Messaging API routes | ❌ Pending | RESTful endpoints + Socket.IO events for real-time chat |
| **CRITICAL** | M8-I3 | Messaging frontend page | ❌ Pending | `/dashboard/messages` with conversation list, chat UI |
| HIGH | M8-I4 | Email service implementation | ❌ Pending | SMTP integration with templates for contract events, disputes |
| HIGH | M8-I5 | Email notification job | ❌ Pending | Background job for batched email delivery |
| MEDIUM | M8-I6 | Push notification support | ❌ Pending | Service worker registration, push subscription, notification display |
| LOW | M8-I7 | Notification preferences | ❌ Pending | User settings for which notifications to receive via which channels |

---

## Cross-Cutting Improvements

| Priority | ID | Improvement | Modules | Details |
|----------|----|-----------  |---------|---------|
| HIGH | CC-I1 | Background job framework (BullMQ) | All | `email.job.ts` and `notification.job.ts` are empty; establish BullMQ workers for all async tasks |
| HIGH | CC-I2 | Error tracking and monitoring | All | Integrate Sentry or similar for production error tracking |
| HIGH | CC-I3 | API rate limiting per endpoint | All | Current rate limiting is global; add endpoint-specific limits for sensitive operations |
| MEDIUM | CC-I4 | Database connection pooling | All | Configure Prisma connection pool for production (min 5, max 20) |
| MEDIUM | CC-I5 | Redis caching for trust scores | 3, 4 | Cache trust score breakdowns in Redis (5 min TTL) to reduce DB queries |
| MEDIUM | CC-I6 | API documentation (Swagger/OpenAPI) | All | Generate from Zod schemas; publish at `/api/docs` |
| MEDIUM | CC-I7 | Integration test suite | All | End-to-end tests covering review → trust score → profile update flow |
| LOW | CC-I8 | Performance budget enforcement | All | Add Lighthouse CI checks to PR pipeline |
| LOW | CC-I9 | Database backup strategy | All | Automated PostgreSQL backups with point-in-time recovery |

---

## Implementation Roadmap

### Phase 1 — Critical Fixes (Current Sprint) ✅ COMPLETE (2026-02-28)
- [x] M3-I1: IPFS service implementation
- [x] M3-I2: Blockchain service implementation
- [x] M3-I3: Review flow integration
- [x] M3-I4: Blockchain retry job
- [x] M4-I1: Trust score history model
- [x] M4-I2: Background recalculation job
- [x] M4-I3: Trust score history endpoint

### Phase 2 — Module 5 & 8 Core (Next Sprint)
- [ ] M5-I1: Dispute service backend
- [ ] M5-I2: Dispute API routes + controller
- [ ] M5-I3: Evidence IPFS upload
- [ ] M5-I4: Juror selection algorithm
- [ ] M8-I1: Messaging service backend
- [ ] M8-I2: Messaging API routes
- [ ] M8-I3: Messaging frontend page
- [ ] CC-I1: BullMQ job framework

### Phase 3 — Module 7 Core
- [ ] M7-I1: Admin service + analytics
- [ ] M7-I2: Admin API routes + controller
- [ ] M7-I3: Admin dashboard page
- [ ] M8-I4: Email service implementation

### Phase 4 — Module 5 & 8 Advanced
- [ ] M5-I5: Juror voting frontend
- [ ] M5-I6: DisputeResolution.sol integration
- [ ] M5-I7: Dispute dashboard page
- [ ] M8-I5: Email notification job
- [ ] M4-I4: Trust score trend chart

### Phase 5 — Polish & Refinement
- [ ] M1-I1: PPR/cacheComponents adoption
- [ ] M2-I1: Escrow integration testing on Hardhat
- [ ] M7-I4: User management
- [ ] M7-I5: Dispute monitoring
- [ ] CC-I2: Error tracking setup

### Phase 6 — Enhancement & Nice-to-Have
- [ ] M2-I3: AI-powered job search
- [ ] M3-I6: Review response mechanism
- [ ] M4-I5: Juror eligibility
- [ ] M8-I6: Push notifications
- [ ] CC-I5: Redis caching
- [ ] CC-I6: Swagger documentation
