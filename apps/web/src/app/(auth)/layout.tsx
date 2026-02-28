import { ReactNode } from 'react';
import Link from 'next/link';

import { BrandMark } from '@/components/layout/brand-mark';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { AnimatedSection } from '@/components/ui/animated-section';

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-gradient-to-br from-emerald-50 via-white to-slate-100 px-4 py-6 text-dt-text sm:px-6 lg:flex-row lg:px-12 lg:py-12">
      <AnimatedSection
        className="flex-1"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center justify-between">
          <BrandMark />
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link href="/" className="text-sm text-dt-text-muted transition hover:text-dt-text">
              Back to site
            </Link>
          </div>
        </div>
        <div className="mt-10 flex items-center justify-center lg:mt-16">
          <div className="w-full max-w-xl rounded-[32px] border border-dt-border bg-dt-surface/90 p-8 shadow-2xl backdrop-blur-xl">
            {children}
          </div>
        </div>
      </AnimatedSection>

      <aside className="relative mt-12 hidden w-full max-w-md flex-col justify-between gap-10 overflow-hidden rounded-[28px] border border-dt-border bg-dt-surface/90 p-8 text-dt-text-muted shadow-2xl lg:mt-0 lg:ml-12 lg:flex">
        <div className="space-y-6">
          <p className="text-xs uppercase tracking-[0.4em] text-emerald-600">Security stack</p>
          <h2 className="text-2xl font-semibold text-dt-text">Wallet-first onboarding, email pairing, optional KYC.</h2>
          <p>
            Connect with RainbowKit, add email for continuity, and toggle KYC only when enterprise buyers require it. We mirror Fiverr-level polish without sacrificing Web3-native assurances.
          </p>
          <div className="rounded-3xl border border-dt-border bg-dt-surface-alt/80 p-6 text-sm text-dt-text-muted">
            <ul className="space-y-4">
              <li>
                <span className="font-semibold text-dt-text">• Wallet signature</span> powers SIWE + session lift.
              </li>
              <li>
                <span className="font-semibold text-dt-text">• Email sync</span> keeps notifications flowing.
              </li>
              <li>
                <span className="font-semibold text-dt-text">• KYC</span> stays optional — unlocks ≥$25k contracts when flipped on.
              </li>
            </ul>
          </div>
        </div>

        <div className="space-y-4 rounded-3xl border border-dt-border bg-dt-surface-alt/80 p-6 text-sm">
          <p className="text-xs uppercase tracking-[0.3em] text-emerald-600">Juror feedback</p>
          <blockquote className="text-lg font-medium text-dt-text">
            "The onboarding experience is the first crypto marketplace that actually feels enterprise-ready."
          </blockquote>
          <p className="text-dt-text-muted">— Maya H., Product Ops @ LayerZero</p>
        </div>
      </aside>
    </div>
  );
}
