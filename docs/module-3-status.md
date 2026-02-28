# Module 3 (Review & Feedback System) Audit

**Updated:** 2026-02-28

This document tracks how the current implementation maps to the SRS requirements in Section 1.7.3 (FE-1 – FE-5), along with gaps, integration status, and improvements applied across the module.

## SRS Feature Status

| SRS ID | Requirement | Status | Notes |
|--------|-------------|--------|-------|
| **FE-1** | Interface for clients to submit ratings and textual comments | ✅ **Complete** | `ReviewForm` component with 4-category star ratings (Communication, Quality, Timeliness, Professionalism), 10–2000 char comment, Zod validation, 0.5-increment ratings |
| **FE-2** | Interface for freelancers to submit "Job Clarity" rating | ✅ **Complete** | Role-aware labels via `review-utils.ts`: freelancer→client uses Communication, Job Clarity, Payment Promptness, Responsiveness |
| **FE-3** | Smart contract integration to store feedback hashes on blockchain (IPFS content) | ⚠️ **Partial** | Database fields exist (`ipfsHash`, `blockchainTxHash`), ReputationRegistry.sol deployed, but IPFS upload and on-chain recording not wired in review flow |
| **FE-4** | Public display of aggregated ratings and individual reviews | ✅ **Complete** | `ReviewSummaryCard` on profiles (talent/[id], clients/[id]), `ReviewList` with author info, rating distribution chart, category averages |
| **FE-5** | Mechanism to view feedback history for specific jobs | ✅ **Complete** | `GET /api/reviews/contract/:contractId` endpoint, `useContractReviews` hook, reviews displayed on contract detail pages |

## Functional Requirement Compliance

| FR ID | Requirement | Status | Implementation |
|-------|-------------|--------|----------------|
| FR-J7.1 | One review per party per contract | ✅ | `@@unique([contractId, authorId])` constraint in Prisma, duplicate check in service |
| FR-J7.2 | Double-blind reviews (14-day window) | ✅ | `DOUBLE_BLIND_WINDOW_MS = 14 days`, reviews hidden until both submit or window expires |
| FR-J7.3 | Reviews immutable after submission | ✅ | No update/delete endpoints exist, UI displays immutability notice |
| FR-J7.4 | Review notification to subject | ✅ | `REVIEW_RECEIVED` notification sent via `notificationService` |
| FR-J7.5 | Trust score recalculation after review | ✅ | `trustScoreService.getTrustScoreBreakdown()` called after each review submission |
| FR-J7.6 | Aggregated review summary endpoint | ✅ | `GET /api/reviews/user/:userId/summary` with rating distribution |
| FR-J7.7 | IPFS content storage | ❌ | `ipfs.service.ts` is empty — review content not uploaded to IPFS |
| FR-J7.8 | On-chain hash via ReputationRegistry | ❌ | `blockchain.service.ts` is empty — hashes not recorded on ReputationRegistry contract |

## Backend Architecture

### API Routes (`apps/api/src/routes/review.routes.ts`)

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/api/reviews` | ✅ Required | Submit review (validated) |
| GET | `/api/reviews/contract/:contractId` | Optional | Get reviews for contract (double-blind) |
| GET | `/api/reviews/contract/:contractId/status` | ✅ Required | Check if user reviewed contract |
| GET | `/api/reviews/user/:userId` | Optional | Get user's reviews with pagination & role filtering |
| GET | `/api/reviews/user/:userId/summary` | Public | Get aggregated review stats |

### Service Layer (`apps/api/src/services/review.service.ts`)

- **`submitReview()`** — Creates review in DB, updates profile stats, recalculates trust scores, sends notification
- **`getUserReviews()`** — Paginated query with double-blind filter (batch counterpart lookup to avoid N+1)
- **`getContractReviews()`** — Both parties' reviews with double-blind rules
- **`getReviewSummary()`** — Aggregate ratings + 5-star distribution
- **`hasReviewed()`** — Boolean check for existing review

### Validation (`apps/api/src/validators/review.validator.ts`)

- `ratingSchema`: 1–5 in 0.5 increments
- `createReviewSchema`: contractId required, overall rating required, comment 10–2000 chars (HTML stripped)
- `getReviewsQuerySchema`: page/limit pagination + role filter (as_client/as_freelancer)

## Frontend Components

| File | Purpose | Lines |
|------|---------|-------|
| `components/reviews/review-form.tsx` | Review submission form with 4-category star ratings | ~165 |
| `components/reviews/review-list.tsx` | Displays reviews with author avatar, date, ratings, blockchain badge | ~90 |
| `components/reviews/review-summary.tsx` | Aggregated stats card (avg rating, distribution, category averages) | ~120 |
| `components/reviews/star-rating.tsx` | Reusable star component (interactive edit or readonly display) | ~60 |
| `components/reviews/index.ts` | Barrel export | ~5 |
| `lib/review-utils.ts` | Role-aware rating label mappings and trust score thresholds | ~30 |
| `lib/api/review.ts` | API client for review endpoints | ~60 |
| `hooks/queries/use-reviews.ts` | TanStack Query hooks (useUserReviews, useReviewSummary, etc.) | ~60 |

### Dashboard Reviews Page (`/dashboard/reviews`)

- Header with "Reviews & Feedback" title
- `ReviewSummaryCard` with aggregated stats
- 3 tabs: All Reviews / As Freelancer / As Client
- `ReviewList` component for individual reviews
- Immutability notice (blockchain-verified badge)

### Profile Integration

- **Freelancer profiles** (`/talent/[id]`): `ReviewSummaryCard` + `ReviewList`
- **Client profiles** (`/clients/[id]`): `ReviewSummaryCard` + `ReviewList`
- **Dashboard**: ReviewSummaryCard widget when data exists

## Database Schema

```prisma
model Review {
  id                    String   @id @default(cuid())
  contractId            String
  authorId              String
  subjectId             String
  overallRating         Decimal  @db.Decimal(3,2)
  communicationRating   Decimal? @db.Decimal(3,2)
  qualityRating         Decimal? @db.Decimal(3,2)
  timelinessRating      Decimal? @db.Decimal(3,2)
  professionalismRating Decimal? @db.Decimal(3,2)
  comment               String?  @db.Text
  ipfsHash              String?
  blockchainTxHash      String?
  isPublic              Boolean  @default(true)
  createdAt             DateTime @default(now())
  updatedAt             DateTime @updatedAt

  @@unique([contractId, authorId])
  @@index([subjectId])
  @@index([overallRating])
}
```

## Smart Contract Integration

### ReputationRegistry.sol (deployed)

```solidity
function recordFeedback(
    uint256 _jobId,
    address _reviewed,
    string memory _contentHash,
    uint8 _rating   // 1-5
) external whenNotPaused
```

- **Deployed at:** `0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9` (Hardhat local)
- **Events:** `FeedbackRecorded(uint256 jobId, address reviewer, address reviewed, string contentHash, uint8 rating)`
- **Backend integration:** ❌ Not wired — `blockchain.service.ts` is empty

## Identified Gaps

| # | Gap | Severity | Recommendation |
|---|-----|----------|----------------|
| 1 | IPFS service not implemented | **HIGH** | Implement `ipfs.service.ts` to upload review content to IPFS and store hash |
| 2 | Blockchain service not implemented | **HIGH** | Implement `blockchain.service.ts` to call `ReputationRegistry.recordFeedback()` |
| 3 | Review flow doesn't store IPFS hash or blockchain tx | **HIGH** | Wire IPFS + blockchain into `reviewService.submitReview()` |
| 4 | `blockchain.job.ts` is empty | **MEDIUM** | Implement background job to retry failed blockchain writes |
| 5 | No public review pages (unauthenticated) | **LOW** | Reviews visible on profile pages (auth optional); acceptable for MVP |
| 6 | No review editing or response mechanism | **LOW** | By design — reviews are immutable (SRS FR-J7.3) |

## Build Status

**Last verified:** 2026-02-28 — Database schema in place, API routes functional, frontend components integrated across profile and dashboard pages.
