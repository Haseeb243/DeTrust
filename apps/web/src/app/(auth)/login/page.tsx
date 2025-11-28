'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { ShieldCheck } from 'lucide-react';

import { useAuthStore } from '@/store';
import { isWalletConnectConfigured } from '@/lib/env';
import { MetaMaskPriorityConnect } from '@/components/wallet/meta-mask-priority';

export default function LoginPage() {
  const router = useRouter();

  const { login, isLoading, error, requires2FA } = useAuthStore();
  const walletReady = isWalletConnectConfigured;

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    twoFactorCode: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    // Wallet enforcement lives here once SIWE is mandatory for login.

    const success = await login(
      formData.email,
      formData.password,
      requires2FA ? formData.twoFactorCode : undefined
    );

    if (success) {
      toast.success('Login successful!');
      router.push('/dashboard');
    }
  };

  return (
    <motion.div
      className="space-y-10 text-slate-900"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div>
        <p className="text-xs uppercase tracking-[0.4em] text-emerald-600">Sign in</p>
        <h1 className="mt-2 text-3xl font-semibold">Welcome back</h1>
        <p className="text-slate-600">Wallet-first access with dual-factor support.</p>
      </div>

      <div className="space-y-4">
        <div className="rounded-3xl border border-emerald-100 bg-emerald-50/80 p-4 text-sm text-emerald-900">
          <p className="flex items-center gap-2 font-semibold">
            <ShieldCheck className="h-4 w-4 text-emerald-500" /> Wallet connection + email required
          </p>
          <p className="text-emerald-700">
            Connect your wallet first, then confirm with your email credentials for dual-factor access.
          </p>
        </div>
        {!walletReady && (
          <div className="rounded-3xl border border-amber-200 bg-amber-50/80 p-4 text-sm text-amber-900">
            <p className="font-semibold">WalletConnect project ID recommended</p>
            <p className="mt-1 text-amber-700">
              Add <code className="text-slate-800">NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID</code> to enable mobile wallets. MetaMask desktop still works instantly.
            </p>
          </div>
        )}
        <MetaMaskPriorityConnect className="border-slate-200" />
      </div>

      <form onSubmit={handleEmailLogin} className="space-y-5 rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-xl">
        <div>
          <label className="text-sm font-medium text-slate-700">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className="input-glass mt-2"
            placeholder="abc@gmail.com"
            required
            disabled={requires2FA}
          />
        </div>
        <div>
          <label className="text-sm font-medium text-slate-700">Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            className="input-glass mt-2"
            placeholder="Haseeb12345"
            required
            disabled={requires2FA}
          />
        </div>
        {requires2FA && (
          <div>
            <label className="text-sm font-medium text-slate-700">2FA Code</label>
            <input
              type="text"
              name="twoFactorCode"
              value={formData.twoFactorCode}
              onChange={handleInputChange}
              className="input-glass mt-2"
              placeholder="123456"
              maxLength={6}
            />
          </div>
        )}
        {error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}
        <button type="submit" className="btn-primary w-full" disabled={isLoading}>
          {isLoading ? 'Verifying credentials…' : requires2FA ? 'Verify 2FA' : 'Sign in securely'}
        </button>
      </form>

      <div className="flex flex-col gap-3 text-center text-sm text-slate-600">
        <Link href="/forgot-password" className="font-semibold text-slate-900">
          Forgot password?
        </Link>
        <p>
          Need an account?{' '}
          <Link href="/register" className="font-semibold text-emerald-600">
            Create workspace
          </Link>
        </p>
      </div>
    </motion.div>
  );
}
