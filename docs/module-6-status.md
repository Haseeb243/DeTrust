# Module 6: AI Capability Prediction — Implementation Status

> Last updated: 2026-03-02

## Progress: 🔜 DEFERRED

---

## Overview

Module 6 implements the **AI Capability Prediction** system, designed to solve the "cold-start" problem for new freelancers who lack reviews or work history. The module uses machine learning to estimate a freelancer's skill level (Beginner → Expert) based on their profile data, educational background, certifications, and portfolio.

> **This module is deferred to a future phase.** The scaffolding remains in the repo for future implementation.

### SRS Requirements

| SRS ID | Requirement | Status | Implementation Details |
|--------|-------------|--------|----------------------|
| **FE-1** | Collect freelancer profile features (skills, education, portfolio) | ⚠️ Scaffolded | `aiCapabilityScore` field in `FreelancerProfile` Prisma model; static scoring in `user.service.ts` |
| **FE-2** | Train ML model on historical performance data | ❌ **Deferred** | Python AI service skeleton exists; no trained model |
| **FE-3** | Display AI-estimated capability badge on profiles | ⚠️ **Partial** | Dashboard shows static score; badge component not yet built |
| **FE-4** | Skill test verification to validate AI predictions | ❌ **Deferred** | Not implemented |

---

## What Exists (Scaffolding)

### Python AI Service (`apps/ai-service/`)

| Component | File | Status |
|-----------|------|--------|
| FastAPI app | `app/main.py` | ✅ Scaffold |
| Prediction router | `app/routers/prediction.py` | ✅ Scaffold |
| Verification router | `app/routers/verification.py` | ✅ Scaffold |
| Pydantic schemas | `app/schemas/` | ✅ Scaffold |
| ML model loader | `app/ml/` | ✅ Scaffold (singleton pattern placeholder) |

### Database

| Field | Table | Type | Description |
|-------|-------|------|-------------|
| `aiCapabilityScore` | `FreelancerProfile` | Decimal? | AI-predicted capability score (0–100) |

### Static Scoring

A basic static `calculateAiCapabilityScore()` function exists in `user.service.ts` that provides a placeholder score based on:
- Skills breadth (number and variety)
- Completed jobs count
- Job success rate

### AI Capability Levels (SRS)

| Level | Score Range | Description |
|-------|-------------|-------------|
| Beginner | 0–34 | New to the platform, limited portfolio |
| Intermediate | 35–59 | Some experience, growing reputation |
| Advanced | 60–79 | Proven track record, strong portfolio |
| Expert | 80–100 | Industry leader, extensive history |

---

## Future Implementation Plan

### Phase 1 — Data Collection
- Gather training data from existing user performance (reviews, completion rates, earnings)
- Feature engineering: skills count, education level, certification count, portfolio diversity

### Phase 2 — Model Training
- scikit-learn RandomForest or XGBoost classifier
- Cross-validation with existing user data
- Deploy model as FastAPI endpoint in `apps/ai-service/`

### Phase 3 — Integration
- Backend: Call AI service from `user.service.ts` after profile updates
- Frontend: `AICapabilityBadge` component with tooltip explaining AI-estimated nature
- Skill tests: 30-day cooldown per skill, multiple-choice + coding challenges

---

## Configuration

No configuration is required for the current phase. When activated in the future:

| Variable | Description | Required |
|----------|-------------|----------|
| `AI_SERVICE_URL` | URL of the Python AI service | Yes |
| `AI_SERVICE_API_KEY` | API key for AI service authentication | Optional |

---

## Dependencies

### Python (apps/ai-service/)
- `fastapi` — Web framework
- `pydantic` v2 — Data validation
- `scikit-learn` — ML model training
- `pandas` — Data processing
- `uvicorn` — ASGI server

### Node.js (apps/api/)
- No additional dependencies required (HTTP client already available)

---

## Related Business Rules

1. **AI Capability Levels**: Beginner (0–34) · Intermediate (35–59) · Advanced (60–79) · Expert (80–100)
2. **Skill test cooldown**: One attempt per skill per 30 days
3. **Profile gate**: AI capability badge only shown after freelancer profile is ≥ 70% complete
4. **Non-blocking**: AI scoring runs asynchronously — profile creation never blocked by AI service
