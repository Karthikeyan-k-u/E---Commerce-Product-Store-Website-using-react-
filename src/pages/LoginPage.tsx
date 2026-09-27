import React, { useState, type FormEvent } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { AlertCircle, LockKeyhole, Mail, ShieldCheck, UserRound } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Logo } from '../components/ui/Logo';
import { SocialConnect } from '../components/ui/SocialConnect';
import { hasLocalUsers, useAuthStore } from '../store/authStore';

type AuthMode = 'signin' | 'register';

export const LoginPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isLoading, error, createAccount, signIn, clearError } = useAuthStore();
  const [mode, setMode] = useState<AuthMode>(() => (hasLocalUsers() ? 'signin' : 'register'));
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [confirmError, setConfirmError] = useState<string | null>(null);
  const from = (
    location.state as {
      from?: { pathname?: string; search?: string };
    } | null
  )?.from;
  const destination = `${from?.pathname ?? '/'}${from?.search ?? ''}`;

  if (user) {
    return <Navigate to={destination} replace />;
  }

  const switchMode = (nextMode: AuthMode) => {
    setMode(nextMode);
    setConfirmError(null);
    clearError();
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setConfirmError(null);
    clearError();

    if (mode === 'register' && password !== confirmPassword) {
      setConfirmError('Passwords do not match.');
      return;
    }

    const success =
      mode === 'register'
        ? await createAccount({ displayName, email, password })
        : await signIn({ email, password });

    if (success) {
      navigate(destination, { replace: true });
    }
  };

  const isRegistering = mode === 'register';

  return (
    <main className="relative min-h-screen overflow-hidden bg-background px-4 py-8 text-text-primary sm:py-12">
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[34rem] w-[34rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-500/10 blur-[130px]" />
      <div className="pointer-events-none absolute -left-32 bottom-0 h-80 w-80 rounded-full bg-cyan-500/10 blur-[110px]" />
      <div className="pointer-events-none absolute -right-32 top-0 h-80 w-80 rounded-full bg-violet-500/10 blur-[110px]" />

      <div className="relative mx-auto flex min-h-[calc(100vh-4rem)] max-w-md flex-col justify-center py-8">
        <div className="mb-8 flex justify-center">
          <Logo size="lg" />
        </div>

        <section className="overflow-hidden rounded-3xl border border-indigo-500/20 bg-white/90 shadow-[0_24px_80px_-32px_rgba(79,70,229,0.45)] backdrop-blur-xl dark:border-indigo-400/20 dark:bg-[#0f1422]/90">
          <div className="px-6 pt-6 sm:px-8 sm:pt-8">
            <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-2xl border border-indigo-500/20 bg-indigo-500/10 text-indigo-500 dark:text-indigo-300">
              <LockKeyhole className="h-5 w-5" />
            </div>
            <h1 className="font-display text-2xl font-extrabold tracking-tight text-[#0F172A] dark:text-[#F8FAFC] sm:text-3xl">
              {isRegistering ? 'Create your account' : 'Welcome back'}
            </h1>
            <p className="mt-3 text-sm leading-6 text-[#64748B] dark:text-[#94A3B8]">
              {isRegistering
                ? 'Create your Whole Mart account to keep your orders and account details together.'
                : 'Sign in to continue shopping and view your orders.'}
            </p>
          </div>

          <div className="mt-6 grid grid-cols-2 border-y border-[#E2E8F0] bg-slate-50/80 dark:border-[#263247] dark:bg-slate-900/50" role="tablist" aria-label="Account access">
            <button
              type="button"
              role="tab"
              aria-selected={!isRegistering}
              onClick={() => switchMode('signin')}
              className={`h-11 text-xs font-semibold transition-colors ${
                !isRegistering
                  ? 'border-b-2 border-indigo-500 bg-white text-indigo-600 dark:bg-[#0f1422] dark:text-indigo-300'
                  : 'border-b-2 border-transparent text-text-muted hover:text-text-primary'
              }`}
            >
              Sign in
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={isRegistering}
              onClick={() => switchMode('register')}
              className={`h-11 text-xs font-semibold transition-colors ${
                isRegistering
                  ? 'border-b-2 border-indigo-500 bg-white text-indigo-600 dark:bg-[#0f1422] dark:text-indigo-300'
                  : 'border-b-2 border-transparent text-text-muted hover:text-text-primary'
              }`}
            >
              Create account
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 px-6 py-6 sm:px-8">
            {error && (
              <div className="flex gap-3 rounded-2xl border border-rose-500/25 bg-rose-500/10 p-4 text-xs leading-5 text-rose-700 dark:text-rose-200" aria-live="polite">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {isRegistering && (
              <Input
                label="Full name"
                value={displayName}
                onChange={(event) => {
                  setDisplayName(event.target.value);
                  clearError();
                }}
                leftIcon={<UserRound className="h-4 w-4" />}
                placeholder="Your name"
                autoComplete="name"
                required
              />
            )}

            <Input
              label="Email address"
              type="email"
              value={email}
              onChange={(event) => {
                setEmail(event.target.value);
                clearError();
              }}
              leftIcon={<Mail className="h-4 w-4" />}
              placeholder="you@example.com"
              autoComplete="email"
              required
            />

            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(event) => {
                setPassword(event.target.value);
                clearError();
              }}
              leftIcon={<LockKeyhole className="h-4 w-4" />}
              placeholder={isRegistering ? 'At least 8 characters' : 'Enter your password'}
              autoComplete={isRegistering ? 'new-password' : 'current-password'}
              minLength={8}
              required
            />

            {isRegistering && (
              <Input
                label="Confirm password"
                type="password"
                value={confirmPassword}
                onChange={(event) => {
                  setConfirmPassword(event.target.value);
                  setConfirmError(null);
                  clearError();
                }}
                leftIcon={<LockKeyhole className="h-4 w-4" />}
                placeholder="Repeat your password"
                autoComplete="new-password"
                minLength={8}
                error={confirmError || undefined}
                required
              />
            )}

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="h-12 w-full"
              isLoading={isLoading}
            >
              {isRegistering ? 'Create account' : 'Sign in'}
            </Button>

            <div className="flex items-center justify-center gap-2 text-[11px] font-medium text-[#94A3B8] dark:text-[#64748B]">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
              Your account stays in this browser
            </div>
          </form>

          <div className="border-t border-[#E2E8F0] px-6 py-6 text-center sm:px-8 dark:border-[#263247]">
            <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-text-muted">
              Follow &amp; stay updated
            </p>
            <SocialConnect />
            <p className="mt-4 text-[11px] leading-5 text-text-muted">
              No account needed to follow us or ask for WhatsApp updates.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
};
