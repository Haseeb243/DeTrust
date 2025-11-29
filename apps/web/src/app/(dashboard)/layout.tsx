'use client';

import { ReactNode, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import {
  Bell,
  Briefcase,
  CreditCard,
  Crown,
  FileText,
  Home,
  LogOut,
  MessageSquare,
  PanelLeftClose,
  PanelLeftOpen,
  PlusCircle,
  Search,
  Settings,
  Shield,
  Star,
  User,
  Users,
  Wallet,
  Zap,
} from 'lucide-react';

import { useAuthStore } from '@/store';
import { cn } from '@/lib/utils';
import { useSecureObjectUrl } from '@/hooks/use-secure-object-url';

const navigation = {
  FREELANCER: [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'Find Jobs', href: '/jobs', icon: Search },
    { name: 'My Proposals', href: '/proposals', icon: FileText },
    { name: 'Active Contracts', href: '/contracts', icon: Briefcase },
    { name: 'Messages', href: '/messages', icon: MessageSquare },
    { name: 'Reviews', href: '/reviews', icon: Star },
    { name: 'Earnings', href: '/payments', icon: Wallet },
    { name: 'Profile', href: '/profile', icon: User },
  ],
  CLIENT: [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'Post Job', href: '/jobs/new', icon: PlusCircle },
    { name: 'My Jobs', href: '/jobs/mine', icon: Briefcase },
    { name: 'Find Talent', href: '/talent', icon: Users },
    { name: 'Active Contracts', href: '/contracts', icon: FileText },
    { name: 'Messages', href: '/messages', icon: MessageSquare },
    { name: 'Reviews', href: '/reviews', icon: Star },
    { name: 'Payments', href: '/payments', icon: CreditCard },
    { name: 'Profile', href: '/profile', icon: User },
    { name: 'Settings', href: '/settings', icon: Settings },
  ],
  ADMIN: [
    { name: 'Dashboard', href: '/admin', icon: Home },
    { name: 'Users', href: '/admin/users', icon: Users },
    { name: 'Jobs', href: '/admin/jobs', icon: Briefcase },
    { name: 'Disputes', href: '/admin/disputes', icon: Shield },
    { name: 'Reports', href: '/admin/reports', icon: FileText },
    { name: 'Settings', href: '/admin/settings', icon: Settings },
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
            <Image
              src="/images/logo.png"
              alt="DeTrust"
              width={48}
              height={48}
              className="h-12 w-12 rounded-2xl object-contain"
            />
            <span className={cn('transition-opacity duration-300', isSidebarCollapsed ? 'opacity-0' : 'opacity-100')}>
              DeTrust
            </span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-1 p-3">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                title={item.name}
                className={cn(
                  'group flex items-center rounded-2xl px-4 py-3 text-sm font-medium transition-all',
                  isSidebarCollapsed ? 'justify-center' : 'gap-3',
                  isActive
                    ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-[0_10px_30px_rgba(16,185,129,0.35)]'
                    : 'text-slate-600 hover:bg-emerald-50 hover:text-emerald-700'
                )}
              >
                <Icon className={cn('h-5 w-5', isActive ? 'text-white' : 'text-slate-400 group-hover:text-emerald-500')} />
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
          {/* Premium Badge */}
          <div className={cn('rounded-2xl bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-600 p-4 text-white shadow-lg', isSidebarCollapsed && 'p-2')}>
            <div className="flex items-center gap-2">
              <Crown className="h-5 w-5 text-amber-300" />
              {!isSidebarCollapsed && (
                <span className="text-xs font-semibold uppercase tracking-wider">Trust Signal</span>
              )}
            </div>
            {!isSidebarCollapsed && (
              <>
                <p className="mt-2 text-2xl font-bold">{user?.freelancerProfile?.trustScore ?? user?.clientProfile?.trustScore ?? 0}%</p>
                <p className="text-xs text-emerald-100">{role === 'FREELANCER' ? 'Freelancer Score' : 'Client Score'}</p>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/20">
                  <div 
                    className="h-full rounded-full bg-white/90 transition-all" 
                    style={{ width: `${user?.freelancerProfile?.trustScore ?? user?.clientProfile?.trustScore ?? 0}%` }}
                  />
                </div>
              </>
            )}
          </div>
          <button
            onClick={handleSignOut}
            className={cn(
              'flex w-full items-center rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-600 transition-all hover:border-red-200 hover:bg-red-50 hover:text-red-600',
              isSidebarCollapsed ? 'justify-center' : 'gap-3'
            )}
          >
            <LogOut className="h-5 w-5" />
            {!isSidebarCollapsed && <span>Sign Out</span>}
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
              {isSidebarCollapsed ? <PanelLeftOpen className="h-5 w-5" /> : <PanelLeftClose className="h-5 w-5" />}
            </button>
            <div className="relative w-[280px] md:w-[360px]">
              <input
                type="search"
                placeholder="Search..."
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 pl-12 text-sm text-slate-800 placeholder:text-slate-400 focus:border-emerald-400 focus:outline-none focus:ring-4 focus:ring-emerald-100"
              />
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-4">
            {/* Notifications */}
            <button className="relative rounded-full border border-slate-200 p-3 text-slate-500 transition-all hover:border-emerald-200 hover:text-emerald-600">
              <Bell className="h-5 w-5" />
              <span className="absolute right-1.5 top-1.5 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
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
              <div className="h-11 w-11 overflow-hidden rounded-full border-2 border-emerald-200 bg-emerald-50 ring-2 ring-emerald-100">
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
                    {avatarLoading ? <Zap className="h-5 w-5 animate-pulse" /> : userInitial}
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
