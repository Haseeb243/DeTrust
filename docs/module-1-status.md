# Module 1 (Client & Freelancer Web App) Audit

**Updated:** 2025-11-27

This document tracks how the current implementation maps to the SRS requirements in Section 1.7.1 (FE-1 – FE-4).

| SRS ID | Requirement | Current Implementation | Status |
|--------|-------------|------------------------|--------|
| **FE-1** | Wallet-based login & authentication (MetaMask / WalletConnect) | Implemented via RainbowKit `ConnectButton` on `apps/web/src/app/(auth)/login/page.tsx` and `register/page.tsx`, backed by SIWE flows in `apps/web/src/store/auth.store.ts`. MetaMask isn’t prioritized, so desktop users sometimes see WalletConnect QR despite having the extension installed. | ⚠️ **Partial** (needs MetaMask-first behavior + better UX copy) |
| **FE-2** | Role selection during onboarding | Multi-step registration (`register/page.tsx`) includes the dedicated role-selection step (`Role` cards) and stores the chosen role when calling `useAuthStore.register`. | ✅ **Complete** |
| **FE-3** | Profile creation and editing | No dedicated profile editor exists under `/dashboard` (no pages/components at `apps/web/src/app/(dashboard)/profile` or related directories). Registration only captures name/email/password; freelancer/client profile fields (bio, skills, company details) are not surfaced. | ❌ **Missing** |
| **FE-4** | Dashboard with active jobs, proposals, notifications, token balance | `apps/web/src/app/(dashboard)/dashboard/page.tsx` renders the shell but relies entirely on placeholder metrics and hard-coded lists; jobs/proposals/earnings aren’t sourced from API data. Notifications widget in layout is non-functional. | ⚠️ **Partial** (UI shell only, lacks live data) |

## Key Gaps

1. **MetaMask-first wallet UX** – RainbowKit defaults to WalletConnect because connectors aren’t customized. Desktop MetaMask should be detected and placed at the top, falling back to WalletConnect.
2. **Profile management** – Need dedicated forms (freelancer + client) that sync with `/users/me` and related API endpoints to fulfill FE-3.
3. **Live dashboards** – Replace placeholder stats with data sourced from `jobs`, `contracts`, and `notifications` endpoints, plus token balances pulled via wagmi when a wallet is connected.

## Next Steps

- Update wagmi/RainbowKit configuration so injected wallets (MetaMask) are primary and WalletConnect remains available as secondary.
- Scope profile editor pages aligned with Freelancer/Client data models.
- Connect dashboard widgets to real API/chain data to eliminate mock numbers.
