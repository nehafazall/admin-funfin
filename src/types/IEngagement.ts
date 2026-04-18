// Spin Configuration Types
export interface SpinRewardTier {
  coins: number
  weight: number
  isActive: boolean
}

export interface SpinConfig {
  id?: string
  dailyLimit: number
  rewardTiers: SpinRewardTier[]
  createdAt?: string
  updatedAt?: string
}

export interface SpinConfigUpdateInput {
  dailyLimit: number
  rewardTiers: SpinRewardTier[]
}

export interface SpinConfigResponse {
  spinConfig: SpinConfig
}

// Mission Types
export type MissionType = "daily" | "weekly" | "special"

export interface Mission {
  id: string
  code: string
  title: string
  description?: string | null
  missionType: MissionType
  rewardCoins: number
  targetCount: number
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface MissionCreateInput {
  code: string
  title: string
  description: string
  missionType: MissionType
  rewardCoins: number
  targetCount: number
  isActive?: boolean
}

export interface MissionUpdateInput {
  title?: string
  description?: string
  missionType?: MissionType
  rewardCoins?: number
  targetCount?: number
  isActive?: boolean
}

export interface MissionListResponse {
  missions: Mission[]
  total: number
}

// Challenge Types
export interface DailyChallenge {
  id: string
  question: string
  options: string[]
  correctOptionIndex: number
  challengeDate?: string | null
  explanation?: string | null
  rewardCoins: number
  isActive: boolean
  createdAt?: string
  updatedAt?: string
}

export interface ChallengCreateInput {
  question: string
  options: string[]
  correctOptionIndex: number
  explanation?: string
  rewardCoins: number
  isActive?: boolean
}

export interface ChallengeUpdateInput {
  question?: string
  options?: string[]
  correctOptionIndex?: number
  explanation?: string
  rewardCoins?: number
  isActive?: boolean
}

export interface ChallengeListResponse {
  challenges?: DailyChallenge[]
  items?: DailyChallenge[]
  total: number
}

export interface ChallengeAssignInput {
  challengeDate?: string
}

// Badge Types
export interface Badge {
  id: string
  code: string
  name: string
  description?: string | null
  iconUrl?: string | null
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface BadgeCreateInput {
  code: string
  name: string
  description?: string
  iconUrl?: string
  isActive?: boolean
}

export interface BadgeUpdateInput {
  code?: string
  name?: string
  description?: string
  iconUrl?: string
  isActive?: boolean
}

export interface BadgeListResponse {
  badges: Badge[]
  total: number
}

// Title Types
export interface Title {
  id: string
  code: string
  name: string
  description?: string | null
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface TitleCreateInput {
  code: string
  name: string
  description?: string
  isActive?: boolean
}

export interface TitleUpdateInput {
  code?: string
  name?: string
  description?: string
  isActive?: boolean
}

export interface TitleListResponse {
  titles: Title[]
  total: number
}

// Notification Types
export interface AdminNotificationCreateInput {
  title: string
  body: string
  userId?: string
  meta?: Record<string, unknown>
}

export interface AdminNotificationResponse {
  message: string
  notificationId?: string
}
