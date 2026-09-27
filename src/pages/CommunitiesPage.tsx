import React from 'react';
import { Link } from 'react-router-dom';
import { Users, ArrowRight, Sparkles, Lock, Check } from 'lucide-react';
import { COMMUNITIES } from '../data/communities';
import { useCommunityStore } from '../store/communityStore';
import { useCommunityGates } from '../hooks/useCommunityUnlock';
import { useToast } from '../components/ui/Toast';
import { Button } from '../components/ui/Button';
import { Breadcrumb } from '../components/ui/Breadcrumb';
import { RevealOnScroll } from '../components/motion/RevealOnScroll';
import { formatNumber } from '../lib/utils';

export const CommunitiesPage: React.FC = () => {
  const { joinedCommunities, join, leave } = useCommunityStore();
  const gates = useCommunityGates();
  const { addToast } = useToast();

  const handleJoin = (slug: string, name: string) => {
    if (!gates[slug]?.canJoin) return;
    join(slug);
    addToast(`Welcome to ${name} — early access unlocked!`, 'success');
  };

  const handleLeave = (slug: string, name: string) => {
    leave(slug);
    addToast(`You left ${name}`, 'info');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10 pb-24">
      <RevealOnScroll variant="fade-up">
        <div className="space-y-3">
          <Breadcrumb items={[{ label: 'Communities' }]} />

          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0b0f19] via-[#111a33] to-[#0b0f19] border border-indigo-500/30 p-8 sm:p-12 text-white">
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="relative z-10 max-w-2xl space-y-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                Membership Circles
              </div>
              <h1 className="text-3xl sm:text-5xl font-black tracking-tight font-display leading-[1.08]">
                Join a Circle.
                <span className="block text-indigo-400">Get there first.</span>
              </h1>
              <p className="text-sm sm:text-base text-slate-300 max-w-xl leading-relaxed">
                Every community unlocks early access to fresh drops, member-only pricing, and first offers —
                24 to 48 hours before anyone else. Buy anything in a discipline and the door opens.
              </p>
              <div className="flex items-center gap-3 pt-1">
                <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-300">
                  <Users className="w-4 h-4 text-indigo-400" />
                  {formatNumber(COMMUNITIES.reduce((sum, c) => sum + c.memberCount, 0))} members across 6 circles
                </span>
                <span className="px-2 py-1 rounded-lg bg-emerald-500/15 border border-emerald-400/30 text-[11px] font-bold text-emerald-300">
                  {joinedCommunities.length} joined
                </span>
              </div>
            </div>
          </div>
        </div>
      </RevealOnScroll>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {COMMUNITIES.map((community, idx) => {
          const isMember = joinedCommunities.includes(community.slug);
          const gate = gates[community.slug];
          return (
            <RevealOnScroll key={community.id} variant="fade-up" delay={idx * 0.07}>
              <div
                className="group h-full flex flex-col rounded-2xl bg-surface border border-surface-border overflow-hidden transition-all duration-300 hover:border-indigo-500/50 hover:shadow-float"
                style={{ boxShadow: isMember ? `0 0 0 1px ${community.color}55` : undefined }}
              >
                <div
                  className="h-2 w-full shrink-0"
                  style={{ backgroundColor: community.color }}
                />
                <div className="p-6 flex flex-col gap-4 flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span
                          className="text-sm font-black font-display tracking-tight text-text-primary group-hover:opacity-90"
                          style={{ color: isMember ? community.color : undefined }}
                        >
                          {community.name}
                        </span>
                        {isMember && (
                          <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-[10px] font-bold text-emerald-500 dark:text-emerald-400">
                            Member
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] font-semibold mt-0.5" style={{ color: community.color }}>
                        {community.category}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 text-[11px] text-text-muted shrink-0">
                      <Users className="w-3.5 h-3.5" />
                      {formatNumber(community.memberCount)}
                    </div>
                  </div>

                  <p className="text-sm text-text-muted leading-relaxed">
                    {community.tagline}
                  </p>

                  <ul className="space-y-1.5">
                    {community.perks.slice(0, 3).map((perk) => (
                      <li key={perk} className="flex items-start gap-2 text-xs text-text-secondary">
                        <Check className="w-3.5 h-3.5 mt-0.5 shrink-0 text-emerald-500 dark:text-emerald-400" />
                        <span>{perk}</span>
                      </li>
                    ))}
                    <li className="flex items-center gap-2 text-xs text-indigo-500 dark:text-indigo-400 font-semibold">
                      <Lock className="w-3.5 h-3.5" />
                      {community.memberDiscountPct}% member pricing
                    </li>
                  </ul>

                  <div className="mt-auto flex flex-col gap-2 pt-2">
                    {gate.canJoin || isMember ? (
                      <Button
                        size="md"
                        variant={isMember ? 'secondary' : 'primary'}
                        onClick={() =>
                          isMember
                            ? handleLeave(community.slug, community.name)
                            : handleJoin(community.slug, community.name)
                        }
                        className="w-full"
                      >
                        {isMember ? 'Leave Community' : 'Join Community'}
                      </Button>
                    ) : (
                      <>
                        <Button size="md" variant="secondary" disabled className="w-full">
                          <Lock className="w-3.5 h-3.5" />
                          Locked
                        </Button>
                        <p className="text-[10px] text-text-muted text-center leading-relaxed">
                          Buy any {community.category} drop to unlock membership
                        </p>
                      </>
                    )}
                    <Link
                      to={`/communities/${community.slug}`}
                      className="text-center text-xs font-semibold text-text-muted hover:text-indigo-500 dark:hover:text-indigo-400 flex items-center justify-center gap-1 py-1 transition-colors"
                    >
                      View circle & drops
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            </RevealOnScroll>
          );
        })}
      </div>
    </div>
  );
};