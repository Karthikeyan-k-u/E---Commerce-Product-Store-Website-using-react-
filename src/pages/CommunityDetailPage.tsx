import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Users, Lock, Check, Copy, ArrowLeft, ShieldCheck, Zap, Truck } from 'lucide-react';
import { COMMUNITIES, getCommunityBySlug, getMemberPrice } from '../data/communities';
import { PRODUCTS } from '../data/products';
import { useCommunityStore } from '../store/communityStore';
import { useCommunityUnlock } from '../hooks/useCommunityUnlock';
import { useToast } from '../components/ui/Toast';
import { Button } from '../components/ui/Button';
import { Breadcrumb } from '../components/ui/Breadcrumb';
import { RevealOnScroll } from '../components/motion/RevealOnScroll';
import { ProductCard } from '../components/product/ProductCard';
import { formatINR, formatNumber } from '../lib/utils';

export const CommunityDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const community = slug ? getCommunityBySlug(slug) : undefined;
  const { joinedCommunities, join, leave } = useCommunityStore();
  // Called before the not-found return, since a hook cannot sit after it.
  const gate = useCommunityUnlock(slug ?? '');
  const { addToast } = useToast();
  const [copied, setCopied] = useState(false);

  if (!community) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center space-y-4">
        <h2 className="text-2xl font-bold text-text-primary">Community Not Found</h2>
        <p className="text-sm text-text-muted">No membership circle exists with that name.</p>
        <Link to="/communities" className="inline-block text-indigo-500 font-semibold underline">
          Browse All Communities
        </Link>
      </div>
    );
  }

  const isMember = joinedCommunities.includes(community.slug);
  const drops = PRODUCTS.filter((p) => community.dropProductIds.includes(p.id));
  const minDropPrice = Math.min(...drops.map((p) => p.price));

  const handleToggle = () => {
    if (isMember) {
      leave(community.slug);
      addToast(`You left ${community.name}`, 'info');
      return;
    }
    if (!gate.canJoin) {
      addToast(
        `Buy any ${community.category} drop to unlock ${community.name} membership`,
        'info'
      );
      return;
    }
    join(community.slug);
    addToast(`Welcome to ${community.name} — early access unlocked!`, 'success');
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(community.promoCode);
    setCopied(true);
    addToast(`Codes "${community.promoCode}" copied to clipboard!`, 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10 pb-24">
      <RevealOnScroll variant="fade-up">
        <div className="space-y-3">
          <Breadcrumb
            items={[
              { label: 'Communities', href: '/communities' },
              { label: community.name },
            ]}
          />
        </div>
      </RevealOnScroll>

      <RevealOnScroll variant="fade-up">
        <div
          className="relative overflow-hidden rounded-3xl border p-8 sm:p-12 text-white"
          style={{
            background: `linear-gradient(135deg, #0b0f19 0%, #111a33 55%, #0b0f19 100%)`,
            borderColor: `${community.color}44`,
            boxShadow: `0 30px 70px -20px rgba(0,0,0,0.8), 0 0 50px -12px ${community.color}55`,
          }}
        >
          <div
            className="absolute -top-24 -right-24 w-96 h-96 rounded-full blur-3xl pointer-events-none"
            style={{ backgroundColor: `${community.color}33` }}
          />
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-7 space-y-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold border"
                style={{ color: community.color, backgroundColor: `${community.color}22`, borderColor: `${community.color}44` }}>
                <Zap className="w-3.5 h-3.5" />
                {community.category} Circle
              </div>
              <h1 className="text-3xl sm:text-5xl font-black tracking-tight font-display leading-[1.08]">
                {community.name}
              </h1>
              <p className="text-sm sm:text-base text-slate-300 max-w-xl leading-relaxed">
                {community.description}
              </p>
              <div className="flex items-center gap-3 pt-1 flex-wrap">
                <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-300">
                  <Users className="w-4 h-4" style={{ color: community.color }} />
                  {formatNumber(community.memberCount)} members
                </span>
                <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-300">
                  <Lock className="w-4 h-4" style={{ color: community.color }} />
                  {community.memberDiscountPct}% member pricing
                </span>
                <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-300">
                  <Truck className="w-4 h-4" style={{ color: community.color }} />
                  First-offer drops 48 hours early
                </span>
              </div>
            </div>

            <div className="lg:col-span-5 space-y-4">
              <div className="p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">Member Pricing</span>
                  <span className="text-[11px] px-2 py-0.5 rounded-full font-bold"
                    style={{ color: community.color, backgroundColor: `${community.color}22` }}>
                    −{community.memberDiscountPct}%
                  </span>
                </div>
                <div className="text-3xl font-black font-display mt-1" style={{ color: community.color }}>
                  from {formatINR(getMemberPrice(community, minDropPrice))}
                </div>
                <div className="text-xs text-slate-400 mt-1.5">
                  vs {formatINR(minDropPrice)} public — members always pay less on every drop.
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm space-y-2">
                <div className="text-xs font-bold text-slate-300 uppercase tracking-wider">Exclusive Offer Codes</div>
                {isMember ? (
                  <>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm font-black tracking-wider px-3 py-1.5 rounded-lg border border-white/15 bg-black/40" style={{ color: community.color }}>
                        {community.promoCode}
                      </span>
                      <Button size="sm" variant="secondary" onClick={handleCopyCode}
                        leftIcon={copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}>
                        {copied ? 'Copied!' : 'Copy'}
                      </Button>
                    </div>
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      Applies automatically at checkout for {community.name} members.
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-center gap-2 text-sm font-bold text-slate-300">
                      <Lock className="w-4 h-4 shrink-0" style={{ color: community.color }} />
                      Unlocks when you join
                    </div>
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                      <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                      {community.name} members get {community.memberDiscountPct}% off automatically at
                      checkout on every drop.
                    </div>
                  </>
                )}
              </div>

              <Button
                size="lg"
                variant={isMember ? 'secondary' : 'primary'}
                onClick={handleToggle}
                className="w-full"
                leftIcon={<Lock className="w-4 h-4" />}
              >
                {isMember
                  ? 'Leave Community'
                  : gate.canJoin
                    ? `Join ${community.name}`
                    : 'Locked'}
              </Button>
              {!isMember && !gate.canJoin && (
                <p className="text-[11px] text-text-muted text-center mt-2 leading-relaxed">
                  Membership is earned. Buy any {community.category} drop below and this unlocks.
                </p>
              )}
            </div>
          </div>
        </div>
      </RevealOnScroll>

      <RevealOnScroll variant="fade-up">
        <div className="p-6 rounded-2xl bg-surface border border-surface-border space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-text-muted">
            What membership includes
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {community.perks.map((perk) => (
              <div key={perk} className="flex items-start gap-2.5 text-sm text-text-secondary p-3 rounded-xl bg-surface-elevated/60 dark:bg-white/[0.03] border border-surface-border">
                <span className="mt-0.5 w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: community.color }} />
                <span>{perk}</span>
              </div>
            ))}
          </div>
        </div>
      </RevealOnScroll>

      <RevealOnScroll variant="fade-up">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4" style={{ color: community.color }} />
              <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: community.color }}>
                {isMember ? 'Unlocked for members' : 'Members-only drops'}
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-text-primary tracking-tight font-display mt-1">
              Exclusive Drops
            </h2>
            {!isMember && (
              <p className="text-xs sm:text-sm text-text-muted mt-1">
                Join {community.name} to unlock member pricing and early access on these products. Buying
                anything in {community.category} is what opens this door.
              </p>
            )}
          </div>
          <Link to="/shop" className="text-xs font-semibold text-indigo-500 hover:text-indigo-400 flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to all communities
          </Link>
        </div>
      </RevealOnScroll>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {drops.map((product, idx) => (
          <RevealOnScroll key={product.id} variant="fade-up" delay={idx * 0.06}>
            <ProductCard product={product} />
          </RevealOnScroll>
        ))}
      </div>
    </div>
  );
};