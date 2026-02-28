'use client';

import { useState } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';

import { authApi } from '@/lib/api';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const response = await authApi.forgotPassword(email);
    
    setIsLoading(false);
    
    if (response.success) {
      setIsSubmitted(true);
      toast.success('Reset link sent!');
    } else {
      toast.error(response.error?.message || 'Failed to send reset link');
    }
  };

  if (isSubmitted) {
    return (
      <div className="w-full max-w-md">
        <div className="glass-card rounded-2xl p-8 text-center text-dt-text">
          <div className="mb-4 text-5xl">📧</div>
          <h1 className="mb-2 text-2xl font-bold">Check Your Email</h1>
          <p className="mb-6 text-dt-text-muted">
            We&apos;ve sent a password reset link to{' '}
            <span className="font-semibold text-dt-text">{email}</span>
          </p>
          <p className="mb-6 text-sm text-dt-text-muted">
            Didn&apos;t receive the email? Check your spam folder or try again.
          </p>
          <button
            onClick={() => setIsSubmitted(false)}
            className="btn-secondary w-full"
          >
            Try Again
          </button>
          <Link
            href="/login"
            className="mt-4 block text-sm text-dt-text-muted hover:text-dt-text"
          >
            Back to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md">
      <div className="glass-card rounded-2xl p-8 text-dt-text">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-2xl font-bold">Forgot Password?</h1>
          <p className="text-dt-text-muted">
            Enter your email and we&apos;ll send you a reset link
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="mb-2 block text-sm font-medium text-dt-text-muted">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="input-glass"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="btn-primary w-full"
          >
            {isLoading ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>

        {/* Footer Link */}
        <p className="mt-6 text-center text-sm text-dt-text-muted">
          Remember your password?{' '}
          <Link href="/login" className="font-semibold text-emerald-600 hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
