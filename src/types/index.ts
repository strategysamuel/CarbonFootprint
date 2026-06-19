// ─── Shared Domain Types ──────────────────────────────────────────────────────

export type AgeGroup = 'under-18' | '18-24' | '25-34' | '35-44' | '45-54' | '55-64' | '65+';

export type Motivation =
  | 'save-money'
  | 'protect-environment'
  | 'improve-health'
  | 'future-generations';

export type CarbonCategory = 'transportation' | 'food' | 'energy' | 'waste';

export type ChallengeType = 'individual' | 'family' | 'office' | 'college';

export type ActivityType =
  | 'car_trip'
  | 'flight'
  | 'public_transport'
  | 'cycling'
  | 'walking'
  | 'meal'
  | 'electricity_usage'
  | 'heating'
  | 'waste_recycled'
  | 'waste_landfill'
  | 'online_purchase'
  | 'streaming';

export type GoalStatus = 'active' | 'completed' | 'failed' | 'paused';

export type BadgeRarity = 'common' | 'rare' | 'epic' | 'legendary';

export type NotificationStatus = 'unread' | 'read' | 'dismissed';

// ─── User ─────────────────────────────────────────────────────────────────────

export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  createdAt: Date;
  updatedAt: Date;
  onboardingCompleted: boolean;
  onboardingData?: OnboardingData;
  settings: UserSettings;
  stats: UserStats;
  fcmToken?: string;
}

export interface OnboardingData {
  country: string;
  city: string;
  ageGroup: AgeGroup;
  motivation: Motivation;
  carbonGoals: CarbonCategory[];
  challengeInterests: ChallengeType[];
  completedAt: Date;
}

export interface UserSettings {
  theme: 'light' | 'dark' | 'system';
  notifications: boolean;
  weeklyReport: boolean;
  nudges: boolean;
  language: string;
  units: 'metric' | 'imperial';
}

export interface UserStats {
  totalCarbonSaved: number;   // kg CO2e
  currentStreak: number;      // days
  longestStreak: number;      // days
  totalActivities: number;
  badgesEarned: number;
  level: number;
  xp: number;
}

// ─── Activity ─────────────────────────────────────────────────────────────────

export interface Activity {
  id: string;
  userId: string;
  type: ActivityType;
  category: CarbonCategory;
  description: string;
  carbonKg: number;           // positive = emission, negative = saving
  metadata: ActivityMetadata;
  date: Date;
  createdAt: Date;
}

export interface ActivityMetadata {
  distance?: number;          // km
  duration?: number;          // minutes
  quantity?: number;
  unit?: string;
  location?: string;
  notes?: string;
}

// ─── Goals ────────────────────────────────────────────────────────────────────

export interface Goal {
  id: string;
  userId: string;
  category: CarbonCategory;
  title: string;
  description: string;
  targetReduction: number;    // kg CO2e per month
  currentProgress: number;    // kg CO2e saved so far
  status: GoalStatus;
  startDate: Date;
  endDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

// ─── Nudges ───────────────────────────────────────────────────────────────────

export interface Nudge {
  id: string;
  userId: string;
  title: string;
  body: string;
  category: CarbonCategory;
  actionUrl?: string;
  scheduledAt: Date;
  sentAt?: Date;
  status: 'pending' | 'sent' | 'dismissed';
  createdAt: Date;
}

// ─── Notifications ────────────────────────────────────────────────────────────

export interface AppNotification {
  id: string;
  userId: string;
  title: string;
  body: string;
  type: 'achievement' | 'nudge' | 'community' | 'system' | 'ai';
  status: NotificationStatus;
  metadata?: Record<string, unknown>;
  createdAt: Date;
  readAt?: Date;
}

// ─── Teams ────────────────────────────────────────────────────────────────────

export interface Team {
  id: string;
  name: string;
  type: ChallengeType;
  createdBy: string;
  members: string[];           // user UIDs
  totalCarbonSaved: number;
  challengeId?: string;
  createdAt: Date;
  updatedAt: Date;
}

// ─── Badges ───────────────────────────────────────────────────────────────────

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: BadgeRarity;
  category: CarbonCategory | 'general';
  requirement: string;
  xpReward: number;
}

// ─── Achievements ─────────────────────────────────────────────────────────────

export interface Achievement {
  id: string;
  userId: string;
  badgeId: string;
  earnedAt: Date;
  metadata?: Record<string, unknown>;
}

// ─── Streaks ──────────────────────────────────────────────────────────────────

export interface Streak {
  id: string;
  userId: string;
  type: 'daily_log' | 'goal_progress' | 'challenge';
  currentCount: number;
  longestCount: number;
  lastActivityAt: Date;
  updatedAt: Date;
}

// ─── AI Recommendations ───────────────────────────────────────────────────────

export interface AIRecommendation {
  id: string;
  userId: string;
  title: string;
  body: string;
  category: CarbonCategory;
  estimatedSaving: number;    // kg CO2e
  difficulty: 'easy' | 'medium' | 'hard';
  actionItems: string[];
  generatedAt: Date;
  dismissed: boolean;
  implemented: boolean;
}

// ─── Dashboard ────────────────────────────────────────────────────────────────

export interface DashboardSummary {
  carbonScore: number;
  weeklyTrend: number;        // % change vs last week
  monthlyEmissions: number;
  topCategory: CarbonCategory;
  activeGoals: number;
  recentActivities: Activity[];
  aiInsight: string;
}

// ─── API Response Types ───────────────────────────────────────────────────────

export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  success: boolean;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}
