"use client";

import { ReactNode } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

import { BrandMark } from '@/components/layout/brand-mark';

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-gradient-to-br from-emerald-50 via-white to-slate-100 px-4 py-6 text-slate-900 sm:px-6 lg:flex-row lg:px-12 lg:py-12">
      <motion.div
        className="flex-1"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center justify-between">
          <BrandMark />
          <Link href="/" className="text-sm text-slate-500 transition hover:text-slate-900">
            Back to site
          </Link>
        </div>
        <div className="mt-10 flex items-center justify-center lg:mt-16">
          <div className="w-full max-w-xl rounded-[32px] border border-slate-200 bg-white/90 p-8 shadow-2xl backdrop-blur-xl">
            {children}
          </div>
        </div>
      </motion.div>

      <aside className="relative mt-12 hidden w-full max-w-md flex-col justify-between gap-10 overflow-hidden rounded-[28px] border border-slate-200 bg-white/90 p-8 text-slate-700 shadow-2xl lg:mt-0 lg:ml-12 lg:flex">
        <div className="space-y-6">
          <p className="text-xs uppercase tracking-[0.4em] text-emerald-600">Security stack</p>
          <h2 className="text-2xl font-semibold text-slate-900">Wallet-first onboarding, email pairing, optional KYC.</h2>
          <p>
            Connect with RainbowKit, add email for continuity, and toggle KYC only when enterprise buyers require it. We mirror Fiverr-level polish without sacrificing Web3-native assurances.
          </p>
          <div className="rounded-3xl border border-slate-200 bg-slate-50/80 p-6 text-sm text-slate-600">
            <ul className="space-y-4">
              <li>
                <span className="font-semibold text-slate-900">• Wallet signature</span> powers SIWE + session lift.
              </li>
              <li>
                <span className="font-semibold text-slate-900">• Email sync</span> keeps notifications flowing.
              </li>
              <li>
                <span className="font-semibold text-slate-900">• KYC</span> stays optional — unlocks ≥$25k contracts when flipped on.
              </li>
            </ul>
          </div>
        </div>

        <div className="space-y-4 rounded-3xl border border-slate-200 bg-slate-50/80 p-6 text-sm">
          <p className="text-xs uppercase tracking-[0.3em] text-emerald-600">Juror feedback</p>
          <blockquote className="text-lg font-medium text-slate-900">
            “The onboarding experience is the first crypto marketplace that actually feels enterprise-ready.”
          </blockquote>
          <p className="text-slate-600">— Maya H., Product Ops @ LayerZero</p>
        </div>
      </aside>
    </div>
  );
}
