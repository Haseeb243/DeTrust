# Module 4 (Trust Scoring Module) Audit

**Updated:** 2026-02-28

This document tracks how the current implementation maps to the SRS requirements in Section 1.7.4 (FE-1 – FE-4), along with gaps, computation logic, and integration status.

## SRS Feature Status

| SRS ID | Requirement | Status | Notes |
|--------|-------------|--------|-------|
| **FE-1** | Collect performance data for freelancers and clients | ✅ **Complete** | Queries Prisma for avg ratings, completion rates, dispute outcomes, hire rates, payment punctuality, job clarity ratings |
| **FE-2** | Compute rule-based trust score for freelancers | ✅ **Complete** | Formula: `(0.4 × AvgRating) + (0.3 × CompletionRate) + (0.2 × DisputeWinRate) + (0.1 × Experience)` |
| **FE-3** | Compute rule-based trust score for clients | ✅ **Complete** | Formula: `(0.4 × AvgRating) + (0.3 × PaymentPunctuality) + (0.2 × HireRate) + (0.1 × JobClarityRating)` |
| **FE-4** | Display real-time trust scores and historical trends on dashboards | ⚠️ **Partial** | Real-time score + component breakdown displayed; historical trends NOT implemented (no time-series data model) |

## Trust Score Formulas

### Freelancer Trust Score (0–100)

| Component | Weight | Data Source | Normalization |
|-----------|--------|-------------|---------------|
| Average Rating | 0.4 | `FreelancerProfile.avgRating` (0–5) | `(avgRating / 5) × 100` |
| Completion Rate | 0.3 | Completed contracts / Total contracts | Direct percentage |
| Dispute Win Rate | 0.2 | Won disputes / Total disputes | Default 50 if no disputes |
| Experience | 0.1 | Completed jobs (capped at 50) | `min((completedJobs / 50) × 100, 100)` |

### Client Trust Score (0–100)

| Component | Weight | Data Source | Normalization |
|-----------|--------|-------------|---------------|
| Average Rating | 0.4 | `ClientProfile.avgRating` (0–5) | `(avgRating / 5) × 100` |
| Payment Punctuality | 0.3 | Completed contracts / Total contracts | Direct percentage |
| Hire Rate | 0.2 | Total contracts / Jobs posted | Capped at 100% |
| Job Clarity Rating | 0.1 | Avg `qualityRating` from freelancer reviews | `(clarityRating / 5) × 100` |

## Functional Requirement Compliance

| FR ID | Requirement | Status | Implementation |
|-------|-------------|--------|----------------|
| FR-P1.1 | Trust score always visible on profiles | ✅ | `TrustScoreCard` on talent/[id], clients/[id], dashboard |
| FR-P1.2 | Trust score breakdown available | ✅ | Component-level detail with weights, raw values, normalized values |
| FR-P1.3 | Color-coded trust score display | ✅ | Emerald (>75), Blue (≥50), Amber (>0), Slate (no data) |
| FR-P1.4 | Trust score recalculated on events | ✅ | Recomputed after review submissions (via `reviewService`) |
| FR-P1.5 | Talent search filtering by min trust score | ✅ | `searchFreelancers()` supports `minTrustScore` param |
| FR-P1.6 | Historical trust score trends | ❌ | No `TrustScoreHistory` model; only current score persisted |
| FR-P1.7 | Background recalculation job | ❌ | `trustScore.job.ts` is empty; scores only computed on-demand |

## Backend Architecture

### API Endpoint

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/api/users/:id/trust-score` | Public (optional auth) | Returns full `TrustScoreBreakdown` |

### Service Layer (`apps/api/src/services/trustScore.service.ts`)

- **`computeFreelancerTrustScore(userId)`** — Queries contracts, disputes, profile data; computes + persists score
- **`computeClientTrustScore(userId)`** — Queries contracts, jobs, reviews; computes + persists score
- **`getTrustScoreBreakdown(userId)`** — Auto-detects role (freelancer vs client) and delegates to correct formula
- **`emptyBreakdown()`** — Returns zero score for users without profiles

### Response Shape

```typescript
interface TrustScoreBreakdown {
  totalScore: number;
  components: Array<{
    label: string;
    weight: number;
    rawValue: number;
    normalizedValue: number;
    weightedValue: number;
  }>;
}
```

## Frontend Components

| File | Purpose | Lines |
|------|---------|-------|
| `components/trust/trust-score-card.tsx` | Full breakdown display with colored progress bars | ~120 |
| `hooks/queries/use-trust-score.ts` | TanStack Query hook for trust score data | ~20 |
| `lib/trust-color.ts` | Trust score color/label utilities (trust palette) | ~30 |

### TrustScoreCard Features

- Large score display (0–100) with dynamic color coding
- Component breakdown section showing each metric + weight
- Colored progress bars per component
- Status labels: "Excellent" (>75), "Good" (≥50), "Developing" (>0), "No data yet"
- Dark mode support via `dt-*` semantic tokens

### Dashboard Integration

| Page | Display |
|------|---------|
| `/dashboard` | Hero stat showing trust score percentage |
| `/talent/[id]` | Full `TrustScoreCard` with breakdown + highlight stat |
| `/clients/[id]` | Trust score percentage + on-chain review count |

## Database Fields

### FreelancerProfile
```prisma
trustScore        Decimal  @default(0) @db.Decimal(5, 2) // 0-100
aiCapabilityScore Decimal  @default(0) @db.Decimal(5, 2) // 0-100
completedJobs     Int      @default(0)
successRate       Decimal  @default(0) @db.Decimal(5, 2)
avgRating         Decimal  @default(0) @db.Decimal(3, 2)
totalReviews      Int      @default(0)
```

### ClientProfile
```prisma
trustScore      Decimal  @default(0) @db.Decimal(5, 2) // 0-100
hireRate        Decimal  @default(0) @db.Decimal(5, 2)
avgRating       Decimal  @default(0) @db.Decimal(3, 2)
totalReviews    Int      @default(0)
```

## Identified Gaps

| # | Gap | Severity | Recommendation |
|---|-----|----------|----------------|
| 1 | No trust score history tracking | **HIGH** | Add `TrustScoreHistory` Prisma model for time-series data |
| 2 | `trustScore.job.ts` is empty | **HIGH** | Implement periodic recalculation job for all users |
| 3 | No trend visualization on frontend | **MEDIUM** | Add line chart showing score over time (requires history model) |
| 4 | Scores only computed on-demand via `getTrustScoreBreakdown()` | **MEDIUM** | Scores should be proactively recalculated via background job |
| 5 | No blockchain anchoring of trust scores | **LOW** | Future: anchor score hashes on ReputationRegistry for decentralized verification |
| 6 | Juror eligibility not enforced | **LOW** | Trust score > 50 check needed in dispute flow (Module 5 dependency) |

## Build Status

**Last verified:** 2026-02-28 — Service layer functional, API endpoint responding, frontend components integrated across profiles and dashboard.
