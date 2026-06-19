import { useAuthStore, selectIsAuthenticated, selectIsOnboarded } from '@/stores/authStore';
import { useGoalsStore, selectActiveGoals } from '@/stores/goalsStore';
import { useNotificationStore } from '@/stores/notificationStore';
import type { Goal, AppNotification } from '@/types';

// Reset Zustand stores between tests
beforeEach(() => {
  useAuthStore.getState().reset();
  useGoalsStore.getState().reset();
  useNotificationStore.getState().reset();
});

// ─── Auth Store ───────────────────────────────────────────────────────────────

describe('authStore', () => {
  it('initialises with null user and loading=true', () => {
    const state = useAuthStore.getState();
    expect(state.user).toBeNull();
    expect(state.loading).toBe(true);
    expect(state.initialized).toBe(false);
  });

  it('selectIsAuthenticated returns false when user is null', () => {
    expect(selectIsAuthenticated(useAuthStore.getState())).toBe(false);
  });

  it('selectIsAuthenticated returns true when user is set', () => {
    useAuthStore.getState().setUser({ uid: 'test-uid' } as never);
    expect(selectIsAuthenticated(useAuthStore.getState())).toBe(true);
  });

  it('selectIsOnboarded returns false when profile has no onboardingCompleted', () => {
    expect(selectIsOnboarded(useAuthStore.getState())).toBe(false);
  });

  it('selectIsOnboarded returns true when onboardingCompleted is true', () => {
    useAuthStore.getState().setProfile({ onboardingCompleted: true } as never);
    expect(selectIsOnboarded(useAuthStore.getState())).toBe(true);
  });

  it('reset clears state', () => {
    useAuthStore.getState().setUser({ uid: 'x' } as never);
    useAuthStore.getState().reset();
    expect(useAuthStore.getState().user).toBeNull();
    expect(useAuthStore.getState().loading).toBe(true);
  });
});

// ─── Goals Store ──────────────────────────────────────────────────────────────

const mockGoal: Goal = {
  id:              'goal-1',
  userId:          'user-1',
  category:        'transportation',
  title:           'Reduce car usage',
  description:     'Use public transport 3x per week',
  targetReduction: 20,
  currentProgress: 8,
  status:          'active',
  startDate:       new Date(),
  endDate:         new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  createdAt:       new Date(),
  updatedAt:       new Date(),
};

describe('goalsStore', () => {
  it('starts with empty goals array', () => {
    expect(useGoalsStore.getState().goals).toHaveLength(0);
  });

  it('addGoal appends to goals array', () => {
    useGoalsStore.getState().addGoal(mockGoal);
    expect(useGoalsStore.getState().goals).toHaveLength(1);
    expect(useGoalsStore.getState().goals[0]?.id).toBe('goal-1');
  });

  it('updateGoal modifies matching goal', () => {
    useGoalsStore.getState().addGoal(mockGoal);
    useGoalsStore.getState().updateGoal('goal-1', { currentProgress: 15 });
    expect(useGoalsStore.getState().goals[0]?.currentProgress).toBe(15);
  });

  it('removeGoal removes matching goal', () => {
    useGoalsStore.getState().addGoal(mockGoal);
    useGoalsStore.getState().removeGoal('goal-1');
    expect(useGoalsStore.getState().goals).toHaveLength(0);
  });

  it('selectActiveGoals returns only active goals', () => {
    useGoalsStore.getState().setGoals([
      mockGoal,
      { ...mockGoal, id: 'goal-2', status: 'completed' },
    ]);
    const active = selectActiveGoals(useGoalsStore.getState());
    expect(active).toHaveLength(1);
    expect(active[0]?.id).toBe('goal-1');
  });
});

// ─── Notification Store ───────────────────────────────────────────────────────

const mockNotif: AppNotification = {
  id:        'notif-1',
  userId:    'user-1',
  title:     'Well done!',
  body:      'You logged your first activity.',
  type:      'achievement',
  status:    'unread',
  createdAt: new Date(),
};

describe('notificationStore', () => {
  it('addNotification increments unreadCount for unread notifications', () => {
    useNotificationStore.getState().addNotification(mockNotif);
    expect(useNotificationStore.getState().unreadCount).toBe(1);
  });

  it('markRead decrements unreadCount', () => {
    useNotificationStore.getState().addNotification(mockNotif);
    useNotificationStore.getState().markRead('notif-1');
    expect(useNotificationStore.getState().unreadCount).toBe(0);
    expect(useNotificationStore.getState().notifications[0]?.status).toBe('read');
  });

  it('markAllRead sets all to read and zeroes unreadCount', () => {
    useNotificationStore.getState().addNotification(mockNotif);
    useNotificationStore.getState().addNotification({ ...mockNotif, id: 'notif-2' });
    useNotificationStore.getState().markAllRead();
    expect(useNotificationStore.getState().unreadCount).toBe(0);
    useNotificationStore.getState().notifications.forEach((n) => {
      expect(n.status).toBe('read');
    });
  });
});
