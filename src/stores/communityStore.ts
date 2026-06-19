import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { Team } from '@/types';
import * as repo from '@/services/communityRepository';

interface CommunityState {
  leaderboard: repo.LeaderboardUser[];
  challenges: repo.Challenge[];
  teams: Team[];
  loading: boolean;
  error: string | null;
  fetchCommunityData: (userId: string) => Promise<void>;
  toggleChallenge: (challengeId: string) => void;
  createTeam: (teamData: Omit<Team, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
}

export const useCommunityStore = create<CommunityState>()(
  devtools(
    (set) => ({
      leaderboard: [],
      challenges: [],
      teams: [],
      loading: false,
      error: null,

      fetchCommunityData: async (userId: string) => {
        set({ loading: true, error: null });
        try {
          const [leaderboard, challenges, teams] = await Promise.all([
            repo.getGlobalLeaderboard(),
            repo.getActiveChallenges(),
            repo.getUserTeams(userId),
          ]);
          set({ leaderboard, challenges, teams, loading: false });
        } catch (error: any) {
          set({ error: error.message, loading: false });
        }
      },

      toggleChallenge: (challengeId: string) => {
        set((state) => ({
          challenges: state.challenges.map(c => 
            c.id === challengeId ? { ...c, joined: !c.joined } : c
          )
        }));
      },

      createTeam: async (teamData) => {
        set({ loading: true, error: null });
        try {
          const newTeam = await repo.createTeam(teamData);
          set((state) => ({ teams: [...state.teams, newTeam], loading: false }));
        } catch (error: any) {
          set({ error: error.message, loading: false });
          throw error;
        }
      }
    }),
    { name: 'community-store' }
  )
);
