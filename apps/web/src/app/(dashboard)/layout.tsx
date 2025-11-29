'use client';

import { ReactNode, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Menu, PanelLeftClose } from 'lucide-react';

import { useAuthStore } from '@/store';
import { cn } from '@/lib/utils';
import { useSecureObjectUrl } from '@/hooks/use-secure-object-url';

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
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    if (!user) return;
    if (!isNewUser) return;
    if (isProfileRoute) return;
    router.replace('/profile');
  }, [isNewUser, isProfileRoute, router, user]);
  
  const role = user?.role || 'FREELANCER';
  const navItems = navigation[role as keyof typeof navigation] || navigation.FREELANCER;
  const { objectUrl: secureAvatarUrl, isLoading: avatarLoading } = useSecureObjectUrl(user?.avatarUrl);
  const userInitial = useMemo(() => user?.name?.[0]?.toUpperCase?.() ?? 'P', [user?.name]);

  const handleSignOut = () => {
    logout();
    router.push('/login');
  };

  const toggleSidebar = () => setSidebarCollapsed((prev) => !prev);

  return (
    <div className="min-h-screen bg-[#f5f7fb] text-slate-900">
      {/* Sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 border-r border-slate-100 bg-gradient-to-b from-white via-emerald-50/40 to-white/90 shadow-[0_30px_90px_rgba(15,23,42,0.12)] backdrop-blur-xl transition-[width] duration-300',
        )}
        style={{ width: isSidebarCollapsed ? '96px' : '18rem' }}
      >
        {/* Logo */}
        <div className="flex h-20 items-center border-b border-slate-100 px-4">
          <Link href="/dashboard" className="flex items-center gap-3 text-2xl font-semibold tracking-tight text-slate-900">
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600 shadow-inner">
              Δ
            </span>
            <span className={cn('transition-opacity duration-300', isSidebarCollapsed ? 'opacity-0' : 'opacity-100')}>
              DeTrust
            </span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-1 p-3">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
            return (
              <Link
                key={item.href}
                href={item.href}
                title={item.name}
                className={cn(
                  'group flex items-center rounded-2xl px-4 py-3 text-sm font-medium transition-all',
                  isSidebarCollapsed ? 'justify-center' : 'gap-3',
                  isActive
                    ? 'bg-slate-900 text-white shadow-[0_10px_30px_rgba(15,23,42,0.25)]'
                    : 'text-slate-500 hover:bg-slate-100'
                )}
              >
                <span className="text-lg">{item.icon}</span>
                <span
                  className={cn(
                    'whitespace-nowrap text-sm font-medium transition-all duration-200',
                    isSidebarCollapsed ? 'max-w-0 opacity-0' : 'max-w-xs opacity-100'
                  )}
                >
                  {item.name}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* Bottom section */}
        <div className="absolute inset-x-0 bottom-0 space-y-3 border-t border-slate-100 p-4">
          <div className="rounded-2xl border border-emerald-100 bg-white/80 p-3 shadow-inner" aria-hidden={isSidebarCollapsed}>
            <p className="text-xs uppercase tracking-[0.3em] text-emerald-500">Signal</p>
            <p className="text-sm font-semibold text-slate-900">{user?.freelancerProfile?.trustScore ?? user?.clientProfile?.trustScore ?? 0}% trust</p>
            <p className="text-xs text-slate-500">{role === 'FREELANCER' ? 'Module 1' : 'Org profile'} in progress</p>
          </div>
          <button
            onClick={handleSignOut}
            className="flex w-full items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white/70 px-4 py-3 text-sm font-semibold text-slate-600 transition-all hover:border-slate-300"
          >
            <span>🚪</span>
            <span className={cn('transition-opacity duration-200', isSidebarCollapsed ? 'opacity-0' : 'opacity-100')}>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div
        className="transition-[padding] duration-300"
        style={{ paddingLeft: isSidebarCollapsed ? '96px' : '18rem' }}
      >
        {/* Header */}
        <header className="sticky top-0 z-40 flex h-20 items-center justify-between border-b border-slate-100 bg-white/90 px-6 backdrop-blur">
          {/* Search */}
          <div className="flex items-center gap-4">
            <button
              onClick={toggleSidebar}
              className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:border-emerald-200 hover:text-emerald-600"
              aria-label="Toggle sidebar"
            >
              {isSidebarCollapsed ? <Menu className="h-5 w-5" /> : <PanelLeftClose className="h-5 w-5" />}
            </button>
            <div className="relative w-[280px] md:w-[360px]">
              <input
                type="search"
                placeholder="Search..."
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 pl-12 text-sm text-slate-800 placeholder:text-slate-400 focus:border-emerald-400 focus:outline-none focus:ring-4 focus:ring-emerald-100"
              />
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                🔍
              </span>
            </div>
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
                {secureAvatarUrl ? (
                  <Image
                    src={secureAvatarUrl}
                    alt={user?.name || 'User'}
                    width={44}
                    height={44}
                    className="h-full w-full object-cover"
                    unoptimized
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-lg font-semibold text-emerald-500">
                    {avatarLoading ? '⏳' : userInitial}
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
