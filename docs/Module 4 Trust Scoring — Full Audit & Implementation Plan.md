# Module 4 Trust Scoring — Full Implementation Plan

**TL;DR:** Implement all 6 gaps from the audit across backend service, dispute integration, frontend components, and shared types. Replace the incorrectly-marked "complete" Step 9 with a full admin trust score panel (listing + manual override) mirroring the existing admin reviews pattern. Add real-time WebSocket trust score push events. 14 steps total across ~20 files.

**Key discoveries:**
- **Real-time scores do NOT exist** — no Socket.io events, no WebSocket listeners. Only TanStack Query on-demand fetch.
- **Admin trust score panel does NOT exist** — no `/admin/trust-scores` endpoint, no frontend page, no service method.
- **Trust score service** has no eligibility gate, no client penalties, no `getHistory()` method.
- **Dispute service** never recalculates trust scores after resolution.
- Existing admin reviews pattern (validator → route → controller → service → frontend API → hook → page + filters + table) is the template to replicate.

---

## Steps

### Backend — Core Service

**1. Add 5-contract minimum threshold**
- File: `apps/api/src/services/trustScore.service.ts`
- Add `MIN_CONTRACTS_FOR_TRUST_SCORE = 5` constant
- Extend `TrustScoreBreakdown` interface with `eligible: boolean`, `minimumContracts?: number`, `currentContracts?: number`, and make `totalScore: number | null`
- In `computeFreelancerTrustScore()` (after line 57 where `completedContracts` is counted): early-return ineligible breakdown when < 5 contracts. Persist `trustScore: 0` in DB.
- Same check in `computeClientTrustScore()`
- Update `emptyBreakdown()` to return `eligible: false`
- All eligible returns include `eligible: true`

**2. Add client cancellation rate + dispute behavior penalties**
- File: `apps/api/src/services/trustScore.service.ts` — `computeClientTrustScore()` method (~line 114)
- Query `prisma.contract.count({ where: { clientId, status: 'CANCELLED' } })` for cancellation rate
- Query `prisma.dispute.count({ where: { contract: { clientId } } })` for dispute rate
- Apply penalty modifiers: cancellation penalty up to -10 pts, dispute penalty up to -15 pts (applied after base 4-component score)
- Append penalty components to breakdown array with negative `weightedValue`

**3. Move trust score history query to service**
- File: `apps/api/src/services/trustScore.service.ts`
- Add `getHistory(userId: string, limit = 30)` method — query `prisma.trustScoreHistory.findMany`, reverse for chronological order, return `{ items, total }`
- File: `apps/api/src/controllers/user.controller.ts` — lines 289–310: replace raw Prisma query with `trustScoreService.getHistory(id, limit)` delegation

### Backend — Dispute Integration

**4. Trigger trust score recalculation after dispute resolution**
- File: `apps/api/src/services/dispute.service.ts`
- Import `trustScoreService` at top (currently only imports `prisma`, error classes, `notificationService`, dispute events)
- In `adminResolve()` method (after notification sending, ~line 450): call `trustScoreService.getTrustScoreBreakdown()` for both `clientId` and `freelancerId` with `.catch()` error logging
- This ensures immediate score update instead of waiting 24h for the daily cron

### Backend — Real-Time WebSocket Events

**5. Add trust score Socket.io events**
- New file: `apps/api/src/events/trustScore.events.ts`
- Create `emitTrustScoreUpdated(userId: string, breakdown: TrustScoreBreakdown)` function following the pattern in `apps/api/src/events/dispute.events.ts` — uses `getIO()` and emits to `user:${userId}` room with event `trust-score:updated`
- File: `apps/api/src/services/trustScore.service.ts` — after persisting the updated trust score in both `computeFreelancerTrustScore()` and `computeClientTrustScore()`, call `emitTrustScoreUpdated(userId, breakdown)`
- This fires on: review submissions, dispute resolutions, daily cron, and on-demand API calls

### Backend — Admin Trust Score Panel

**6. Admin trust score validator**
- New schema in `apps/api/src/validators/admin.validator.ts`
- `adminTrustScoresQuerySchema`: Zod schema with `page`, `limit`, `search` (name/email), `role` (FREELANCER | CLIENT | all), `minScore`, `maxScore`, `eligible` (true/false — filter by ≥5 contracts), `sort` (trustScore | name | createdAt | completedContracts), `order` (asc/desc)
- `adminAdjustTrustScoreSchema`: Zod schema with `adjustment: number` (-100 to +100), `reason: string` (required, min 10 chars)

**7. Admin trust score service methods**
- File: `apps/api/src/services/admin.service.ts`
- Add `listTrustScores(query)` method following the exact pattern of `listReviews()` at line 587: build Prisma `where` from filters, query users with joined `freelancerProfile`/`clientProfile`, return paginated `{ items, total, page, limit, totalPages, hasNext, hasPrev }`
- Each item includes: `userId`, `name`, `email`, `role`, `avatarUrl`, `trustScore`, `completedContracts`, `eligible`, `lastUpdated`, `components` breakdown
- Add `adjustTrustScore(userId, adjustment, reason, adminId)` method: manually adjust a user's trust score with clamping 0–100, create a `TrustScoreHistory` entry with admin metadata in the `breakdown` JSON field, emit WebSocket event

**8. Admin trust score controller + routes**
- File: `apps/api/src/controllers/admin.controller.ts` — add `listTrustScores` and `adjustTrustScore` handlers following existing pattern (delegate to service, return `{ success: true, data }`)
- File: `apps/api/src/routes/admin.routes.ts` — add:
  - `GET /trust-scores` with `validateQuery(adminTrustScoresQuerySchema)`
  - `PATCH /trust-scores/:userId` with `validateBody(adminAdjustTrustScoreSchema)`
- Export new controller methods in the `adminController` object

### Frontend — Types & API

**9. Update frontend `TrustScoreBreakdown` type**
- File: `apps/web/src/lib/api/user.ts` — update `TrustScoreBreakdown` at line 132: add `eligible: boolean`, `minimumContracts?: number`, `currentContracts?: number`, change `totalScore` to `number | null`

**10. Add admin trust score API types + methods**
- File: `apps/web/src/lib/api/admin.ts` — add:
  - `AdminTrustScoreListParams` interface (mirrors validator params)
  - `AdminTrustScoreEntry` interface (userId, name, email, role, avatarUrl, trustScore, completedContracts, eligible, lastUpdated, components)
  - `AdminAdjustTrustScorePayload` interface (adjustment, reason)
  - `adminApi.listTrustScores(params)` — `GET /admin/trust-scores`
  - `adminApi.adjustTrustScore(userId, payload)` — `PATCH /admin/trust-scores/:userId`

**11. Add admin trust score TanStack Query hook**
- File: `apps/web/src/hooks/queries/use-admin.ts` — add:
  - `adminKeys.trustScores(params)` query key
  - `useAdminTrustScores(params)` query hook (pattern matches `useAdminReviews` at line 102)
  - `useAdjustTrustScore()` mutation hook with `invalidateQueries` on success

### Frontend — Components & Pages

**12. Update TrustScoreCard for eligibility + penalties**
- File: `apps/web/src/components/trust-score/trust-score-card.tsx`
- When `breakdown.eligible === false`: shield icon with dashed border, "Not Yet Eligible" heading, progress indicator "N/5 contracts completed" with mini progress bar, grayed-out styling
- When `eligible === true`: keep current rendering
- For penalty components (negative `weightedValue`): render in separate "Penalties" section with red/amber bars and minus sign display

**13. Build admin trust score page** (replicating admin reviews pattern)
- New folder: `apps/web/src/app/(dashboard)/admin/trust-scores/`
- New file: `trust-scores/page.tsx` — modeled on `reviews/page.tsx` (124 lines). Includes: stat cards (avg score, eligible users, ineligible users), `AdminTrustScoreFilters`, `AdminTrustScoreTable`, pagination, "Trust Score Integrity" notice card
- New file: `apps/web/src/components/admin/admin-trust-score-filters.tsx` — filter bar: search input, role select (Freelancer/Client/All), min/max score range, eligibility toggle, sort select, clear button. Pattern: `admin-review-filters.tsx`
- New file: `apps/web/src/components/admin/admin-trust-score-table.tsx` — table with columns: User (avatar + name), Role, Trust Score (color-coded badge), Eligible, Completed Contracts, Last Updated. Expandable row shows full component breakdown + admin adjust button. Pattern: `admin-review-table.tsx`
- New file: `apps/web/src/components/admin/admin-adjust-score-dialog.tsx` — `AlertDialog` (shadcn/ui) for manual override: slider/input for adjustment (-100 to +100), required reason textarea (min 10 chars), preview showing current → adjusted score, confirm button
- Add navigation link to admin sidebar/nav for "Trust Scores"

**14. Add frontend WebSocket listener for trust score updates**
- File: where Socket.io client is initialized (check `apps/web/src/hooks/` or `apps/web/src/lib/`)
- Listen for `trust-score:updated` event
- On receive: invalidate TanStack Query cache for `trustScoreKeys.user(userId)` and `trustScoreKeys.history(userId)` — triggers automatic re-fetch
- This makes the dashboard TrustScoreCard and TrustScoreTrendChart update live

### Shared Types + Docs

**15. Update shared types package**
- File: `packages/types/src/user.ts` — ensure `FreelancerProfile.trustScore` and `ClientProfile.trustScore` type annotations acknowledge 0 = ineligible (no new DB fields needed)

**16. Update background job for eligibility**
- File: `apps/api/src/jobs/trustScore.job.ts` — after calling `computeFreelancerTrustScore`/`computeClientTrustScore`, only create `TrustScoreHistory` entries when `breakdown.eligible === true`. Ineligible users skip history creation.

**17. Update docs**
- Rewrite `docs/module-4-status.md` with accurate findings
- Update `docs/Module 4 Trust Scoring — Full Audit & Implementation Plan.md` Step 9 to reflect admin trust score panel instead of "no change"

---

## Verification

1. `pnpm build` — both `apps/api` and `apps/web` compile clean
2. `npx tsc --noEmit` in both apps — no type errors
3. Manual: new user dashboard → "Not Yet Eligible" card with progress bar
4. Manual: user with ≥5 contracts → full breakdown with score
5. Manual: client with cancelled contracts → penalty components visible
6. Manual: resolve a dispute → trust scores update immediately (check DB + WebSocket push)
7. Manual: `/admin/trust-scores` page → list all users with filters, expand for breakdown, manual adjust works with reason required
8. Manual: admin adjusts score → user's dashboard updates in real-time via WebSocket
9. Manual: admin reviews page → still fully functional (no regressions)
10. Background job check: only eligible users get `TrustScoreHistory` entries

---

## Decisions

| Decision | Rationale |
|----------|-----------|
| **Admin trust score panel scope** | View + manual override with required reason — following same pattern as admin reviews (validator → route → controller → service → API → hook → page + filters + table + dialog). Adjustments recorded in `TrustScoreHistory` with admin metadata. |
| **Real-time via Socket.io** | New `trust-score:updated` event emitted from service layer. Frontend invalidates TanStack Query cache on receive for live updates. |
| **Client penalties as modifiers** | Preserves documented 4-component SRS formula. Cancellation rate (up to -10 pts) and dispute behavior (up to -15 pts) applied as post-formula deductions. |
| **5-contract minimum** | User requirement + prevents meaningless scores for new users. API returns structured `eligible: false` response for clear UX. |
| **Trust score recalc after dispute** | Added to `dispute.service.ts` → ensures immediate score update instead of waiting 24h for daily cron. |
| **History query moved to service** | Follows separation of concerns — controller should not query Prisma directly. |

---

## Execution Order

Backend core (1–3) → dispute integration (4) → WebSocket events (5) → admin backend (6–8) → frontend types (9–10) → frontend hook (11) → frontend UI (12–13) → WebSocket listener (14) → types + job + docs (15–17). Dependencies flow forward.

**File count:** ~8 new files, ~12 modified files across both apps.
