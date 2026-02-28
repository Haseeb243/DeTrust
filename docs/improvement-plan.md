# DeTrust — Improvement Plan (All Modules)

**Created:** 2026-02-28

This document outlines recommended improvements across all four implemented modules, prioritized by severity and impact. Items are organized by module, with cross-cutting improvements listed separately.

---

## Module 1: Client & Freelancer Web App

| Priority | ID | Improvement | Status | Details |
|----------|----|-------------|--------|---------|
| HIGH | M1-I1 | PPR / cacheComponents for dashboard pages | ❌ Pending | Dashboard pages still use `'use client'`; convert to Server Components with `use cache` directives for faster TTFB |
| HIGH | M1-I2 | Production contract addresses | ❌ Pending | Blockchain contract addresses are zero/placeholder — need real deployment for testnet/mainnet |
| MEDIUM | M1-I3 | Offline/PWA support | ❌ Pending | Add service worker for offline dashboard access and push notifications |
| MEDIUM | M1-I4 | E2E test coverage expansion | ⚠️ Partial | 34 tests in module 1; expand to cover wallet flows, profile editing, and contract interactions |
| LOW | M1-I5 | Image optimization for profile avatars | ❌ Pending | Use Next.js `<Image>` with width/height hints + blur placeholder for avatar and portfolio images |
| LOW | M1-I6 | Session refresh UX | ✅ Done | 401 auto-retry with deduplication already implemented (H-4) |

---

## Module 2: Smart Contract Job Board

| Priority | ID | Improvement | Status | Details |
|----------|----|-------------|--------|---------|
| HIGH | M2-I1 | Escrow integration with real smart contract calls | ⚠️ Partial | `JobEscrow.sol` deployed but frontend wagmi `useWriteContract` calls need verification on live chain |
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

### Phase 1 — Critical Fixes (Current Sprint)
- [x] M3-I1: IPFS service implementation
- [x] M3-I2: Blockchain service implementation
- [x] M3-I3: Review flow integration
- [x] M3-I4: Blockchain retry job
- [x] M4-I1: Trust score history model
- [x] M4-I2: Background recalculation job
- [x] M4-I3: Trust score history endpoint

### Phase 2 — High Priority (Next Sprint)
- [ ] M1-I1: PPR/cacheComponents adoption
- [ ] M1-I2: Production contract deployment
- [ ] M2-I1: Live escrow integration testing
- [ ] CC-I1: BullMQ job framework
- [ ] CC-I2: Error tracking setup

### Phase 3 — Medium Priority
- [ ] M2-I3: AI-powered job search
- [ ] M2-I4: Proposal comparison view
- [ ] M3-I6: Review response mechanism
- [ ] M4-I4: Trust score trend chart
- [ ] M4-I5: Juror eligibility
- [ ] CC-I5: Redis caching for trust scores
- [ ] CC-I6: Swagger documentation

### Phase 4 — Low Priority / Nice-to-Have
- [ ] M1-I3: PWA support
- [ ] M2-I6: Job templates
- [ ] M3-I8: Review PDF export
- [ ] M4-I8: Trust score threshold notifications
- [ ] M4-I9: On-chain trust score anchoring
