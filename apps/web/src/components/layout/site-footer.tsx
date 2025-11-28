import Link from 'next/link';
import { BrandMark } from './brand-mark';

const LINKS = [
  {
    title: 'Product',
    items: [
      { label: 'Overview', href: '/' },
      { label: 'Job Board', href: '/jobs' },
      { label: 'Trust Engine', href: '#trust' },
      { label: 'Disputes', href: '#workflow' },
    ],
  },
  {
    title: 'Company',
    items: [
      { label: 'About', href: '/about' },
      { label: 'Docs', href: '/docs' },
      { label: 'Careers', href: '/careers' },
      { label: 'Press', href: '/press' },
    ],
  },
  {
    title: 'Legal',
    items: [
      { label: 'Terms', href: '/terms' },
      { label: 'Privacy', href: '/privacy' },
      { label: 'Security', href: '/security' },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="relative mt-24 rounded-3xl border border-slate-200 bg-white px-6 py-10 shadow-lg shadow-slate-100/70">
      <div className="grid gap-10 md:grid-cols-[1.3fr_1fr_1fr_1fr]">
        <div className="space-y-4">
          <BrandMark href="/" />
          <p className="text-sm text-slate-600">
            DeTrust blends AI capability scoring, provable escrow, and decentralized arbitration into a single workspace for serious hiring teams.
          </p>
        </div>
        {LINKS.map((group) => (
          <div key={group.title} className="space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
              {group.title}
            </p>
            <ul className="space-y-2 text-sm text-slate-600">
              {group.items.map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className="transition-colors hover:text-slate-900">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="mt-10 border-t border-slate-200 pt-6 text-xs text-slate-500">
        © {new Date().getFullYear()} DeTrust. All rights reserved.
      </div>
    </footer>
  );
}
