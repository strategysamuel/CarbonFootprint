'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Trophy,
  Users,
  Zap,
  Globe,
  Star,
  ChevronRight,
  UserCheck,
  Flame,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/stores/authStore';
import { useCommunityStore } from '@/stores/communityStore';
import type { Challenge } from '@/services/communityRepository';
import type { ChallengeType } from '@/types';

// ─── Rank Badge ───────────────────────────────────────────────────────────────

function RankBadge({ rank }: { rank: number }) {
  if (rank === 1) return <span className="text-lg" title="1st place">🥇</span>;
  if (rank === 2) return <span className="text-lg" title="2nd place">🥈</span>;
  if (rank === 3) return <span className="text-lg" title="3rd place">🥉</span>;
  return <span className="text-sm font-bold text-text-muted w-6 text-center">#{rank}</span>;
}

// ─── Leaderboard Table ────────────────────────────────────────────────────────

function LeaderboardSection() {
  const { leaderboard } = useCommunityStore();
  const { user } = useAuthStore();

  return (
    <motion.div
      className="glass-card overflow-hidden"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
    >
      <div className="px-6 py-4 border-b border-surface-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Trophy className="w-4 h-4 text-amber-400" aria-hidden="true" />
          <h2 className="font-semibold text-text-primary">Global Leaderboard</h2>
        </div>
        <span className="text-xs text-text-muted">This month</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm" aria-label="Global carbon savings leaderboard">
          <thead>
            <tr className="border-b border-surface-border">
              <th className="px-6 py-3 text-left text-xs font-semibold text-text-muted uppercase tracking-wider">Rank</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-text-muted uppercase tracking-wider">User</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-text-muted uppercase tracking-wider">CO₂ Saved</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-text-muted uppercase tracking-wider hidden sm:table-cell">Streak</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-text-muted uppercase tracking-wider hidden md:table-cell">Level</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-border/50">
            {leaderboard.map((leader, i) => {
              const isCurrentUser = leader.userId === user?.uid;
              return (
              <motion.tr
                key={leader.userId || leader.rank}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.04 }}
                className={cn(
                  'transition-colors hover:bg-surface-tertiary',
                  isCurrentUser && 'bg-brand-950/40 border-l-2 border-l-brand-500'
                )}
              >
                <td className="px-6 py-3.5">
                  <RankBadge rank={leader.rank} />
                </td>
                <td className="px-4 py-3.5">
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        'w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0',
                        isCurrentUser
                          ? 'bg-brand-600 text-white'
                          : 'bg-surface-tertiary text-text-secondary'
                      )}
                      aria-hidden="true"
                    >
                      {leader.avatar}
                    </div>
                    <div>
                      <div className="font-medium text-text-primary flex items-center gap-1.5">
                        {leader.name}
                        {isCurrentUser && (
                          <span className="text-[10px] bg-brand-600 text-white px-1.5 py-0.5 rounded-full font-semibold">You</span>
                        )}
                      </div>
                      <div className="text-xs text-text-muted">{leader.country}</div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3.5 text-right">
                  <span className="font-semibold text-brand-400 tabular-nums">{leader.saved.toFixed(1)}kg</span>
                </td>
                <td className="px-4 py-3.5 text-right hidden sm:table-cell">
                  <span className="flex items-center justify-end gap-1 text-text-secondary">
                    <Flame className="w-3 h-3 text-orange-400" aria-hidden="true" />
                    {leader.streak}d
                  </span>
                </td>
                <td className="px-4 py-3.5 text-right hidden md:table-cell">
                  <span className="text-xs font-semibold text-purple-400">Lv.{leader.level}</span>
                </td>
              </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}

// ─── Teams Section ────────────────────────────────────────────────────────────

function TeamsSection() {
  const { teams } = useCommunityStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  return (
    <>
    <motion.div
      className="glass-card p-6"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-sky-400" aria-hidden="true" />
          <h2 className="font-semibold text-text-primary">My Teams</h2>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="text-xs text-brand-400 hover:text-brand-300 transition-colors font-medium"
        >
          Create team →
        </button>
      </div>

      <div className="space-y-3">
        {teams.length === 0 ? (
          <div className="text-sm text-text-muted text-center py-4">No teams yet.</div>
        ) : (
          teams.map((team) => (
            <div
              key={team.id}
              className="flex items-center gap-4 p-4 rounded-xl bg-surface-tertiary/50 hover:bg-surface-tertiary transition-colors"
            >
              <div className="w-10 h-10 rounded-xl bg-sky-950 flex items-center justify-center flex-shrink-0">
                <Users className="w-5 h-5 text-sky-400" aria-hidden="true" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-text-primary text-sm">{team.name}</div>
                <div className="text-xs text-text-muted">{team.type} · {team.members.length} members</div>
              </div>
              <div className="text-right">
                <div className="text-sm font-bold text-brand-400 tabular-nums">{team.totalCarbonSaved.toFixed(0)}kg</div>
                <div className="text-xs text-text-muted">saved</div>
              </div>
              <ChevronRight className="w-4 h-4 text-text-muted flex-shrink-0" aria-hidden="true" />
            </div>
          ))
        )}
      </div>
    </motion.div>
    <CreateTeamModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}

function CreateTeamModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { createTeam } = useCommunityStore();
  const { user } = useAuthStore();
  const [name, setName] = useState('');
  const [type, setType] = useState<ChallengeType>('office');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !user?.uid) return;
    setIsSubmitting(true);
    try {
      await createTeam({
        name: name.trim(),
        type,
        createdBy: user.uid,
        members: [user.uid],
        totalCarbonSaved: 0,
      });
      onClose();
      setName('');
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card w-full max-w-md p-6 relative border border-surface-border/50"
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-text-muted hover:text-text-primary">✕</button>
        <h2 className="text-xl font-bold text-text-primary mb-4 flex items-center gap-2">
          <Users className="w-5 h-5 text-sky-400" />
          Create a Team
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">Team Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full bg-surface-tertiary border border-surface-border rounded-xl px-4 py-2.5 text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-500 transition-shadow"
              placeholder="e.g. Green Commuters"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">Team Type</label>
            <select
              value={type}
              onChange={e => setType(e.target.value as ChallengeType)}
              className="w-full bg-surface-tertiary border border-surface-border rounded-xl px-4 py-2.5 text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-500 transition-shadow"
            >
              <option value="individual">Individual</option>
              <option value="family">Family</option>
              <option value="office">Office</option>
              <option value="college">College</option>
            </select>
          </div>
          <button
            type="submit"
            disabled={isSubmitting || !name.trim()}
            className="w-full btn-brand py-3 rounded-xl disabled:opacity-50 mt-2 font-semibold"
          >
            {isSubmitting ? 'Creating...' : 'Create Team'}
          </button>
        </form>
      </motion.div>
    </div>
  );
}

// ─── Challenge Card ───────────────────────────────────────────────────────────

function ChallengeCard({ challenge }: { challenge: Challenge }) {
  const { toggleChallenge } = useCommunityStore();

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-5 flex flex-col gap-4"
    >
      <div className="flex items-start gap-3">
        <div className="text-2xl flex-shrink-0" aria-hidden="true">{challenge.icon}</div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-0.5">
            <span className="text-xs font-semibold text-text-muted bg-surface-tertiary px-2 py-0.5 rounded-full">
              {challenge.category}
            </span>
            {challenge.daysLeft <= 5 && (
              <span className="text-xs font-semibold text-red-400 bg-red-950/40 px-2 py-0.5 rounded-full">
                {challenge.daysLeft}d left!
              </span>
            )}
          </div>
          <h3 className="font-semibold text-text-primary">{challenge.title}</h3>
          <p className="text-xs text-text-muted mt-1 line-clamp-2">{challenge.description}</p>
        </div>
      </div>

      <div className="flex items-center gap-4 text-xs text-text-muted">
        <span className="flex items-center gap-1">
          <UserCheck className="w-3.5 h-3.5" aria-hidden="true" />
          {challenge.participants.toLocaleString()} joined
        </span>
        <span className="flex items-center gap-1">
          <Star className="w-3.5 h-3.5 text-amber-400" aria-hidden="true" />
          {challenge.reward}
        </span>
      </div>

      <button
        onClick={() => toggleChallenge(challenge.id)}
        className={cn(
          'w-full rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-200 active:scale-[0.98]',
          challenge.joined
            ? 'border border-brand-500/50 text-brand-400 bg-brand-950/50 hover:bg-red-950/40 hover:text-red-400 hover:border-red-500/50'
            : 'btn-brand'
        )}
      >
        {challenge.joined ? '✓ Joined — Leave?' : 'Join Challenge'}
      </button>
    </motion.div>
  );
}

// ─── Stats strip ─────────────────────────────────────────────────────────────

function CommunityStats() {
  const stats = [
    { icon: Globe,  label: 'Active users',  value: '18,432', color: 'text-sky-400'    },
    { icon: Zap,    label: 'CO₂ saved today', value: '12.4t', color: 'text-brand-400' },
    { icon: Trophy, label: 'Challenges live',  value: '24',    color: 'text-amber-400' },
    { icon: Users,  label: 'Teams active',     value: '1,209', color: 'text-purple-400'},
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      {stats.map(({ icon: Icon, label, value, color }, i) => (
        <motion.div
          key={label}
          className="glass-card p-4 flex items-center gap-3"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0  }}
          transition={{ delay: i * 0.06 }}
        >
          <Icon className={cn('w-5 h-5 flex-shrink-0', color)} aria-hidden="true" />
          <div>
            <div className={cn('text-lg font-bold font-display', color)}>{value}</div>
            <div className="text-xs text-text-muted">{label}</div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function CommunityPage() {
  const { user } = useAuthStore();
  const { challenges, fetchCommunityData } = useCommunityStore();

  useEffect(() => {
    if (user?.uid) {
      fetchCommunityData(user.uid);
    }
  }, [user?.uid, fetchCommunityData]);

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl font-bold font-display text-text-primary">Community</h1>
        <p className="text-text-muted text-sm mt-1">
          Compete, collaborate, and challenge each other to reduce carbon footprints together.
        </p>
      </motion.div>

      <CommunityStats />

      <div className="grid xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2">
          <LeaderboardSection />
        </div>
        <div>
          <TeamsSection />
        </div>
      </div>

      <div>
        <motion.div
          className="flex items-center gap-2 mb-5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25 }}
        >
          <Zap className="w-4 h-4 text-brand-400" aria-hidden="true" />
          <h2 className="font-semibold text-text-primary">Active Challenges</h2>
        </motion.div>
        <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {challenges.map((c, i) => (
            <motion.div
              key={c.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0  }}
              transition={{ delay: 0.28 + i * 0.06 }}
            >
              <ChallengeCard challenge={c} />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
