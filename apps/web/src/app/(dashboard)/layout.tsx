'use client';

import { ReactNode, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { ConnectButton } from '@rainbow-me/rainbowkit';

import { useAuthStore } from '@/store';
import { cn } from '@/lib/utils';

const navigation = {
  FREELANCER: [
    { name: 'Dashboard', href: '/dashboard', icon: '🏠' },
    { name: 'Find Jobs', href: '/jobs', icon: '🔍' },
    { name: 'My Proposals', href: '/proposals', icon: '📝' },
    { name: 'Active Contracts', href: '/contracts', icon: '📋' },
    { name: 'Messages', href: '/messages', icon: '💬' },
    { name: 'Reviews', href: '/reviews', icon: '⭐' },
    { name: 'Earnings', href: '/earnings', icon: '💰' },
    { name: 'Profile', href: '/profile', icon: '👤' },
  ],
  CLIENT: [
    { name: 'Dashboard', href: '/dashboard', icon: '🏠' },
    { name: 'Post Job', href: '/jobs/new', icon: '➕' },
    { name: 'My Jobs', href: '/jobs/mine', icon: '📋' },
    { name: 'Find Talent', href: '/talent', icon: '🔍' },
    { name: 'Active Contracts', href: '/contracts', icon: '📋' },
    { name: 'Messages', href: '/messages', icon: '💬' },
    { name: 'Reviews', href: '/reviews', icon: '⭐' },
    { name: 'Payments', href: '/payments', icon: '💰' },
    { name: 'Profile', href: '/profile', icon: '👤' },
    { name: 'Settings', href: '/settings', icon: '⚙️' },
  ],
  ADMIN: [
    { name: 'Dashboard', href: '/admin', icon: '🏠' },
    { name: 'Users', href: '/admin/users', icon: '👥' },
    { name: 'Jobs', href: '/admin/jobs', icon: '📋' },
    { name: 'Disputes', href: '/admin/disputes', icon: '⚖️' },
    { name: 'Reports', href: '/admin/reports', icon: '📊' },
    { name: 'Settings', href: '/admin/settings', icon: '⚙️' },
  ],
};

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout, isNewUser } = useAuthStore();
  const isProfileRoute = pathname?.startsWith('/profile');

  useEffect(() => {
    if (!user) return;
    if (!isNewUser) return;
    if (isProfileRoute) return;
    router.replace('/profile');
  }, [isNewUser, isProfileRoute, router, user]);
  
  const role = user?.role || 'FREELANCER';
  const navItems = navigation[role as keyof typeof navigation] || navigation.FREELANCER;

  const handleSignOut = () => {
    logout();
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-[#f5f7fb] text-slate-900">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-50 w-72 border-r border-slate-100 bg-white/95 shadow-[0_25px_60px_rgba(15,23,42,0.08)] backdrop-blur">
        {/* Logo */}
        <div className="flex h-20 items-center border-b border-slate-100 px-6">
          <Link href="/dashboard" className="text-2xl font-semibold tracking-tight text-slate-900">
            DeTrust
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-1 p-4">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all',
                  isActive
                    ? 'bg-slate-900 text-white shadow-[0_10px_30px_rgba(15,23,42,0.25)]'
                    : 'text-slate-500 hover:bg-slate-100'
                )}
              >
                <span>{item.icon}</span>
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Bottom section */}
        <div className="absolute bottom-0 left-0 right-0 border-t border-slate-100 p-4">
          <button
            onClick={handleSignOut}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-slate-500 transition-all hover:bg-slate-100"
          >
            <span>🚪</span>
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="pl-72">
        {/* Header */}
        <header className="sticky top-0 z-40 flex h-20 items-center justify-between border-b border-slate-100 bg-white/90 px-8 backdrop-blur">
          {/* Search */}
          <div className="relative w-96">
            <input
              type="search"
              placeholder="Search..."
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 pl-12 text-sm text-slate-800 placeholder:text-slate-400 focus:border-emerald-400 focus:outline-none focus:ring-4 focus:ring-emerald-100"
            />
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
              🔍
            </span>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-4">
            {/* Notifications */}
            <button className="relative rounded-full border border-slate-200 p-3 text-slate-500 transition-all hover:border-slate-300 hover:text-slate-900">
              <span className="text-lg">🔔</span>
            </button>

            {/* Wallet */}
            <ConnectButton 
              showBalance={false}
              chainStatus="icon"
              accountStatus="avatar"
            />

            {/* User menu */}
            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="text-sm font-semibold text-slate-900">{user?.name || 'User'}</div>
                <div className="text-xs text-slate-500 capitalize">
                  {role.toLowerCase()}
                  {isNewUser && !isProfileRoute ? ' · complete profile' : ''}
                </div>
              </div>
              <div className="h-11 w-11 overflow-hidden rounded-full border border-emerald-100 bg-emerald-50">
                {user?.avatarUrl ? (
                  <Image
                    src={user.avatarUrl}
                    alt={user.name || 'User'}
                    width={40}
                    height={40}
                    className="h-full w-full object-cover"
                    unoptimized
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-emerald-500">
                    {user?.name?.[0] || '?'}
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="min-h-[calc(100vh-5rem)] p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
