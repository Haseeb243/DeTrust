"use client";

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface BrandMarkProps {
  href?: string;
  showWordmark?: boolean;
  className?: string;
}

export function BrandMark({ href = '/', showWordmark = true, className }: BrandMarkProps) {
  const content = (
    <motion.span
      className="flex items-center gap-3"
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
    >
      <span className="relative inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-lg">
        <Image src="/images/logo.png" alt="DeTrust logo" width={48} height={48} className="h-10 w-10 rounded-xl object-contain" priority />
      </span>
      {showWordmark && (
        <span className="text-lg font-semibold tracking-tight text-slate-900">
          De<span className="text-emerald-500">Trust</span>
        </span>
      )}
    </motion.span>
  );

  if (!href) {
    return <div className={className}>{content}</div>;
  }

  return (
    <Link href={href} className={className} aria-label="DeTrust home">
      {content}
    </Link>
  );
}
