import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { LogOut, MapPin, Package, ShieldCheck } from 'lucide-react';
import { Breadcrumb } from '../components/ui/Breadcrumb';
import { Button } from '../components/ui/Button';
import { useOrderStore } from '../store/orderStore';
import { useAuthStore } from '../store/authStore';

export const AccountPage: React.FC = () => {
  const { orders } = useOrderStore();
  const { user, signOut } = useAuthStore();
  const [activeTab, setActiveTab] = useState<'profile' | 'addresses'>('profile');

  if (!user) return null;

  const displayName = user.displayName || user.email.split('@')[0];
  const initials = displayName
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0))
    .join('')
    .toUpperCase();
  const userOrders = orders.filter((order) => order.userId === user.uid);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-24">
      <div className="space-y-3">
        <Breadcrumb items={[{ label: 'Account' }]} />
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-surface-border pb-4">
          <div className="flex items-center gap-3.5">
            <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-indigo-600 to-cyan-500 text-white font-extrabold text-xl flex items-center justify-center shadow-glow">
              {initials}
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-text-primary tracking-tight font-display">
                {displayName}
              </h1>
              <p className="text-xs text-text-muted">{user.email}</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Link to="/account/orders">
              <Button variant="outline" size="sm" leftIcon={<Package className="w-4 h-4 text-indigo-400" />}>
                View Orders ({userOrders.length})
              </Button>
            </Link>
            <Button
              variant="outline"
              size="sm"
              onClick={signOut}
              leftIcon={<LogOut className="w-4 h-4 text-rose-500" />}
            >
              Sign out
            </Button>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 border-b border-surface-border" role="tablist" aria-label="Account sections">
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'profile'}
          onClick={() => setActiveTab('profile')}
          className={`pb-3 px-4 text-xs font-semibold border-b-2 transition-colors ${
            activeTab === 'profile'
              ? 'border-indigo-500 text-indigo-500'
              : 'border-transparent text-text-muted hover:text-text-primary'
          }`}
        >
          Profile Information
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'addresses'}
          onClick={() => setActiveTab('addresses')}
          className={`pb-3 px-4 text-xs font-semibold border-b-2 transition-colors ${
            activeTab === 'addresses'
              ? 'border-indigo-500 text-indigo-500'
              : 'border-transparent text-text-muted hover:text-text-primary'
          }`}
        >
          Saved Addresses
        </button>
      </div>

      {activeTab === 'profile' && (
        <section className="max-w-2xl overflow-hidden rounded-2xl border border-surface-border bg-surface">
          <div className="flex items-center gap-4 border-b border-surface-border p-6">
            <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-indigo-600 to-cyan-500 text-white font-extrabold text-xl flex items-center justify-center">
              {initials}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-base font-bold text-text-primary">Member Account</h2>
                <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                  Active
                </span>
              </div>
              <p className="mt-1 text-xs text-text-muted">Your Whole Mart account</p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 p-6 sm:grid-cols-2">
            <div className="rounded-2xl border border-surface-border bg-surface-elevated p-4">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">Full name</span>
              <p className="mt-2 text-sm font-semibold text-text-primary">{displayName}</p>
            </div>
            <div className="rounded-2xl border border-surface-border bg-surface-elevated p-4">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">Email address</span>
              <p className="mt-2 break-all text-sm font-semibold text-text-primary">{user.email}</p>
            </div>
          </div>

          <div className="mx-6 mb-6 flex gap-3 rounded-2xl border border-indigo-500/15 bg-indigo-500/5 p-4">
            <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-indigo-500 dark:text-indigo-400" />
            <p className="text-xs leading-5 text-text-secondary">
              You will stay signed in on this browser until you choose Sign out.
            </p>
          </div>
        </section>
      )}

      {activeTab === 'addresses' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-5 rounded-2xl bg-surface border border-indigo-500/40 shadow-sm space-y-2 relative">
            <span className="absolute top-4 right-4 px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-[10px] font-bold">
              Default Delivery
            </span>
            <div className="flex items-center gap-2 text-xs font-bold text-text-primary">
              <MapPin className="w-4 h-4 text-indigo-500" />
              <span>Primary Address</span>
            </div>
            <p className="text-xs text-text-secondary leading-relaxed pt-1">
              42, Tech Innovation Boulevard, Sector 4<br />
              Near BDA Complex, HSR Layout<br />
              Bengaluru, Karnataka — 560102
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
