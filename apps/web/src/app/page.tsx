import Link from 'next/link';
import { ArrowUpRight, GitBranch, ShieldCheck, Sparkles, Users } from 'lucide-react';

import { SiteHeader } from '@/components/layout/site-header';
import { SiteFooter } from '@/components/layout/site-footer';
import { AnimatedSection, AnimatedH1, AnimatedP } from '@/components/ui/animated-section';
import { HoverCard, HoverScale } from '@/components/ui/hover-card-motion';

const HERO_STATS = [
  { label: 'Escrow volume secured', value: '$5.2M+', helper: 'Instant release via JobEscrow' },
  { label: 'Median hire time', value: '36h', helper: 'AI-matched shortlists' },
  { label: 'Average trust score', value: '94 / 100', helper: 'On-chain & AI verified' },
];

const TRUST_PILLARS = [
  {
    icon: <ShieldCheck className="h-5 w-5 text-emerald-600" />,
    title: 'Programmable escrow',
    description: 'Funds lock on job acceptance and release automatically on milestone sign-off or arbitration.',
  },
  {
    icon: <Sparkles className="h-5 w-5 text-sky-600" />,
    title: 'AI capability index',
    description: 'Cold-start talent receives instant credibility from portfolio parsing & micro skill trials.',
  },
  {
    icon: <Users className="h-5 w-5 text-violet-600" />,
    title: 'Community arbitration',
    description: 'Disputes resolve in days through jurors weighted by verifiable trust scores.',
  },
];

const WORKFLOW = [
  'Choose Client or Freelancer role, wallet-first with optional email pairing',
  'Complete modular onboarding (profile, rates, compliance, optional KYC)',
  'Match with AI-ranked jobs / talent, track proposals, sign contract',
  'Smart escrow automations + milestone reviews + dispute guard rails',
];

const TALENT_CATEGORIES = ['AI & Agents', 'DeFi & Protocols', 'Product & UI', 'Smart Contracts', 'Ops & Compliance', 'Growth & GTM'];

const SECURITY_STACK = [
  {
    label: 'Notifications',
    headline: 'Milestone approved · 2 min ago',
    copy: 'Funds queued for release via JobEscrow smart contract.',
    accent: 'from-emerald-50 to-white',
  },
  {
    label: 'Token balance',
    headline: '12,450 USDC',
    copy: 'Cross-chain payouts supported out of the box.',
    accent: 'from-sky-50 to-white',
  },
  {
    label: 'Trust delta',
    headline: '+2.4 this week',
    copy: 'Streak bonuses for dispute-free completions.',
    accent: 'from-violet-50 to-white',
  },
];

export default function HomePage() {
  return (
    <main className="relative mx-auto flex min-h-screen w-full flex-col gap-16 px-4 py-6 sm:px-8 lg:px-16 xl:px-24">
      <SiteHeader />

      <section className="mx-auto grid max-w-7xl gap-10 md:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-8">
          <AnimatedSection
            className="inline-flex items-center gap-2 rounded-full border border-dt-border/80 bg-dt-surface px-4 py-2 text-xs uppercase tracking-[0.2em] text-dt-text-muted shadow-[0_15px_45px_rgba(15,23,42,0.08)]"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            Ultra-secure talent cloud
          </AnimatedSection>
          <AnimatedH1
            className="text-4xl font-semibold leading-tight md:text-5xl lg:text-[3.65rem]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Grow global teams with <span className="gradient-text">verifiable trust</span> & motion-first workflows.
          </AnimatedH1>
          <AnimatedP
            className="max-w-2xl text-lg text-dt-text-muted"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            DeTrust merges Web3 security with marketplace polish. Think Fiverr-level usability with Polygon-settled escrow, RainbowKit wallet flows, and instant AI capability scores.
          </AnimatedP>

          <AnimatedSection
            className="flex flex-col gap-3 sm:flex-row"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
          >
            <Link href="/register" className="btn-primary">
              Launch Workspace <ArrowUpRight className="h-4 w-4" />
            </Link>
            <Link href="/login" className="btn-secondary">
              I already have an account
            </Link>
          </AnimatedSection>

          <div className="grid gap-6 rounded-3xl border border-dt-border bg-dt-surface/90 p-6 shadow-[0_35px_120px_rgba(15,23,42,0.12)] md:grid-cols-3">
            {HERO_STATS.map((stat, idx) => (
              <AnimatedSection
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + idx * 0.05 }}
              >
                <p className="text-sm uppercase tracking-widest text-dt-text-muted">{stat.label}</p>
                <p className="mt-3 text-2xl font-semibold">{stat.value}</p>
                <p className="text-sm text-dt-text-muted">{stat.helper}</p>
              </AnimatedSection>
            ))}
          </div>
        </div>

        <AnimatedSection
          className="relative rounded-[32px] border border-dt-border bg-gradient-to-br from-white via-emerald-50/40 to-slate-50 p-8 text-sm shadow-[0_35px_120px_rgba(15,23,42,0.1)]"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div className="grid-overlay absolute inset-3 rounded-[28px] opacity-80" />
          <div className="relative space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-sm uppercase tracking-[0.4em] text-dt-text-muted">Realtime Trustline</h3>
              <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-600">Live</span>
            </div>
            <div className="rounded-3xl border border-slate-100 bg-dt-surface p-6 shadow-inner">
              <p className="text-xs uppercase tracking-[0.4em] text-dt-text-muted">AI capability</p>
              <div className="mt-2 flex items-end justify-between">
                <p className="text-4xl font-semibold">96</p>
                <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-medium text-emerald-600">Expert</span>
              </div>
              <p className="mt-3 text-sm text-dt-text-muted">Portfolio, Git, and skill tests scored in seconds. KYC remains optional but boosts discoverability.</p>
            </div>
            <div className="rounded-3xl border border-slate-100 bg-dt-surface p-6 shadow-inner">
              <p className="text-xs uppercase tracking-[0.4em] text-dt-text-muted">Escrow status</p>
              <div className="mt-3 grid gap-4 text-sm">
                <div className="flex items-center justify-between">
                  <span>Milestone 2 · UI overhaul</span>
                  <span className="font-semibold text-emerald-600">Funded 100%</span>
                </div>
                <div className="h-2 rounded-full bg-dt-surface-alt">
                  <span className="block h-full w-3/4 rounded-full bg-gradient-to-r from-emerald-400 to-cyan-400" />
                </div>
                <p className="text-dt-text-muted">Release triggered automatically once both parties sign off or jurors decide.</p>
              </div>
            </div>
          </div>
        </AnimatedSection>
      </section>

      <section id="solutions" className="mx-auto max-w-7xl space-y-12">
        <div className="space-y-4 text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-dt-text-muted">For buyers & builders</p>
          <h2 className="text-3xl font-semibold">One workspace to hire, collaborate, and payout globally.</h2>
          <p className="text-dt-text-muted">Wallet-first auth, optional email pairing, and a marketplace experience polished enough to rival Fiverr or Freelancer.</p>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {TRUST_PILLARS.map((pillar) => (
            <HoverCard
              key={pillar.title}
              className="glass-card p-6 shadow-[0_30px_80px_rgba(15,23,42,0.08)]"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-dt-surface-alt">
                {pillar.icon}
              </div>
              <h3 className="text-xl font-semibold">{pillar.title}</h3>
              <p className="mt-2 text-sm text-dt-text-muted">{pillar.description}</p>
            </HoverCard>
          ))}
        </div>
      </section>

      <section id="talent" className="mx-auto max-w-7xl rounded-[32px] border border-dt-border bg-dt-surface/90 p-8 shadow-[0_35px_120px_rgba(15,23,42,0.1)]">
        <div className="flex flex-col gap-8 lg:flex-row">
          <div className="flex-1 space-y-4">
            <p className="text-xs uppercase tracking-[0.4em] text-dt-text-muted">Curated talent cloud</p>
            <h3 className="text-3xl font-semibold">Tap into guild-verified specialists across high-stakes categories.</h3>
            <p className="text-dt-text-muted">Browse by trust tier, chain experience, compliance readiness, or AI capability rating. Shortlists include wallet provenance and optional KYC badges.</p>
          </div>
          <div className="flex flex-1 flex-wrap gap-3">
            {TALENT_CATEGORIES.map((tag) => (
              <HoverScale
                key={tag}
                className="rounded-2xl border border-dt-border bg-dt-surface px-4 py-2 text-sm font-medium text-dt-text-muted"
              >
                {tag}
              </HoverScale>
            ))}
          </div>
        </div>
      </section>

      <section id="workflow" className="mx-auto grid max-w-7xl gap-10 md:grid-cols-[1fr_1fr]">
        <div className="space-y-4">
          <p className="text-xs uppercase tracking-[0.4em] text-dt-text-muted">Workflow</p>
          <h3 className="text-3xl font-semibold">From wallet connect to final payout — every touchpoint choreographed.</h3>
          <p className="text-dt-text-muted">Wallet auth stays primary, but email pairing and optional KYC can be toggled anytime from onboarding. Clients get admin-grade controls without the clunk.</p>
          <ul className="space-y-4">
            {WORKFLOW.map((step, index) => (
              <li key={step} className="glass-card flex items-center p-4 text-sm text-dt-text-muted">
                <span className="mr-3 inline-flex h-8 w-8 items-center justify-center rounded-full border border-emerald-100 bg-emerald-50 font-semibold text-emerald-600">{index + 1}</span>
                {step}
              </li>
            ))}
          </ul>
        </div>
        <div className="grid gap-6">
          <div className="rounded-3xl border border-dt-border bg-dt-surface p-6 shadow-[0_25px_65px_rgba(15,23,42,0.08)]">
            <div className="flex items-center justify-between text-sm text-dt-text-muted">
              <span>Compliance add-ons</span>
              <span className="font-semibold text-emerald-600">Optional</span>
            </div>
            <div className="mt-4 space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span>Wallet signature</span>
                <span className="font-medium text-dt-text-muted">Required</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Email pairing</span>
                <span className="font-medium text-dt-text-muted">Recommended</span>
              </div>
              <div className="flex items-center justify-between">
                <span>KYC (passport / govt ID)</span>
                <span className="text-dt-text-muted">Optional · unlocks ≥ $25k contracts</span>
              </div>
            </div>
          </div>
          <div className="rounded-3xl border border-dt-border bg-dt-surface p-6 shadow-[0_25px_65px_rgba(15,23,42,0.08)]">
            <h4 className="text-lg font-semibold">Motion-first dashboards</h4>
            <p className="mt-2 text-dt-text-muted">Staggered reveals, card-based navigation, and glassmorphism executed with restraint, matching the professionalism of leading marketplaces.</p>
            <div className="mt-4 flex items-center gap-3 text-sm font-medium text-emerald-600">
              <GitBranch className="h-4 w-4" /> Live KPI loops
            </div>
          </div>
        </div>
      </section>

      <section id="security-stack" className="mx-auto max-w-7xl rounded-[32px] border border-dt-border bg-dt-surface p-8 shadow-[0_35px_120px_rgba(15,23,42,0.12)]">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div className="space-y-4">
            <p className="text-xs uppercase tracking-[0.3em] text-dt-text-muted">Security Stack</p>
            <h3 className="text-3xl font-semibold">Signal-dense dashboards sized for PMs, revops, and trust & safety leads.</h3>
            <p className="text-dt-text-muted">Resizeable cards, live annotations, and juror verdict feeds make sure compliance never feels bolted on.</p>
          </div>
          <div className="space-y-4">
            {SECURITY_STACK.map((card) => (
              <div
                key={card.label}
                className={`rounded-3xl border border-slate-100 bg-gradient-to-br ${card.accent} p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)]`}
              >
                <p className="text-sm uppercase tracking-[0.25em] text-dt-text-muted">{card.label}</p>
                <p className="mt-2 text-xl font-semibold text-dt-text">{card.headline}</p>
                <p className="mt-1 text-sm text-dt-text-muted">{card.copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl rounded-[32px] border border-dt-border bg-dt-surface p-10 text-center shadow-[0_25px_80px_rgba(15,23,42,0.08)]">
        <p className="text-xs uppercase tracking-[0.4em] text-dt-text-muted">Ready?</p>
        <h3 className="mt-3 text-3xl font-semibold">Spin up your dual-auth workspace today.</h3>
        <p className="mt-2 text-dt-text-muted">Wallet → email pairing → optional KYC. Your call.</p>
        <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
          <Link href="/register?role=freelancer" className="btn-primary">
            Join as Freelancer
          </Link>
          <Link href="/register?role=client" className="btn-secondary">
            Hire Elite Talent
          </Link>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
