import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { AppNotification } from '@/types';

interface NotificationState {
  notifications:  AppNotification[];
  unreadCount:    number;
  loading:        boolean;
  error:          string | null;

  setNotifications:     (notifications: AppNotification[]) => void;
  addNotification:      (notification: AppNotification) => void;
  markRead:             (id: string) => void;
  markAllRead:          () => void;
  removeNotification:   (id: string) => void;
  setLoading:           (loading: boolean) => void;
  setError:             (error: string | null) => void;
  reset:                () => void;
}

export const useNotificationStore = create<NotificationState>()(
  devtools(
    (set) => ({
      notifications: [],
      unreadCount:   0,
      loading:       false,
      error:         null,

      setNotifications: (notifications) =>
        set({
          notifications,
          unreadCount: notifications.filter((n) => n.status === 'unread').length,
        }),

      addNotification: (notification) =>
        set((state) => ({
          notifications: [notification, ...state.notifications],
          unreadCount:   state.unreadCount + (notification.status === 'unread' ? 1 : 0),
        })),

      markRead: (id) =>
        set((state) => ({
          notifications: state.notifications.map((n) =>
            n.id === id ? { ...n, status: 'read' as const, readAt: new Date() } : n
          ),
          unreadCount: Math.max(0, state.unreadCount - 1),
        })),

      markAllRead: () =>
        set((state) => ({
          notifications: state.notifications.map((n) => ({
            ...n,
            status: 'read' as const,
            readAt: n.readAt ?? new Date(),
          })),
          unreadCount: 0,
        })),

      removeNotification: (id) =>
        set((state) => {
          const removed = state.notifications.find((n) => n.id === id);
          return {
            notifications: state.notifications.filter((n) => n.id !== id),
            unreadCount: removed?.status === 'unread'
              ? Math.max(0, state.unreadCount - 1)
              : state.unreadCount,
          };
        }),

      setLoading: (loading) => set({ loading }),
      setError:   (error)   => set({ error }),
      reset:      ()        => set({ notifications: [], unreadCount: 0, loading: false, error: null }),
    }),
    { name: 'notification-store' }
  )
);

export const selectUnreadCount    = (s: NotificationState) => s.unreadCount;
export const selectNotifications  = (s: NotificationState) => s.notifications;
