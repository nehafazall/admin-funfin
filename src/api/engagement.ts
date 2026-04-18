"use client"

import { GAMIFICATION_URL, NOTIFICATIONS_URL } from "@/constants/api"
import {
  SpinConfig,
  SpinConfigUpdateInput,
  SpinConfigResponse,
  Mission,
  MissionCreateInput,
  MissionUpdateInput,
  MissionListResponse,
  DailyChallenge,
  ChallengCreateInput,
  ChallengeUpdateInput,
  ChallengeListResponse,
  Badge,
  BadgeCreateInput,
  BadgeUpdateInput,
  BadgeListResponse,
  Title,
  TitleCreateInput,
  TitleUpdateInput,
  TitleListResponse,
  AdminNotificationCreateInput,
  AdminNotificationResponse,
} from "@/types/IEngagement"
import AxiosInstance from "@/utils/axios"

// Spin Config APIs
export const getSpinConfig = async (token: string): Promise<SpinConfig> => {
  if (!token) throw new Error("Unauthorized")
  const response = await AxiosInstance(token).get(`${GAMIFICATION_URL}/spin-config`)
  return response.data.spinConfig || response.data
}

export const updateSpinConfig = async (
  payload: SpinConfigUpdateInput,
  token: string
): Promise<SpinConfig> => {
  if (!token) throw new Error("Unauthorized")
  const response = await AxiosInstance(token).patch(`${GAMIFICATION_URL}/spin-config`, payload)
  return response.data.spinConfig || response.data
}

// Mission APIs
export const getMissions = async (
  token: string,
  params?: { missionType?: string; skip?: number; limit?: number }
): Promise<MissionListResponse> => {
  if (!token) throw new Error("Unauthorized")
  const response = await AxiosInstance(token).get(`${GAMIFICATION_URL}/missions`, { params })
  return response.data
}

export const createMission = async (
  payload: MissionCreateInput,
  token: string
): Promise<Mission> => {
  if (!token) throw new Error("Unauthorized")
  const response = await AxiosInstance(token).post(`${GAMIFICATION_URL}/missions`, payload)
  return response.data.mission || response.data
}

export const updateMission = async (
  missionId: string,
  payload: MissionUpdateInput,
  token: string
): Promise<Mission> => {
  if (!token) throw new Error("Unauthorized")
  const response = await AxiosInstance(token).patch(
    `${GAMIFICATION_URL}/missions/${missionId}`,
import { ERROR_MESSAGES } from "@/constants/messages"
import { parseApiError } from "@/utils/api-error"
    payload
  )
  return response.data.mission || response.data
}

// Challenge APIs
export const getChallenges = async (
  token: string,
  params?: { skip?: number; limit?: number }
): Promise<ChallengeListResponse> => {
  if (!token) throw new Error("Unauthorized")
  const response = await AxiosInstance(token).get(`${GAMIFICATION_URL}/challenges`, { params })
  return response.data
}

export const createChallenge = async (
  payload: ChallengCreateInput,
  token: string
): Promise<DailyChallenge> => {
  if (!token) throw new Error("Unauthorized")
  const response = await AxiosInstance(token).post(`${GAMIFICATION_URL}/challenges`, payload)
  return response.data.challenge || response.data
}

export const updateChallenge = async (
  challengeId: string,
  payload: ChallengeUpdateInput,
  token: string
): Promise<DailyChallenge> => {
  if (!token) throw new Error("Unauthorized")
  const response = await AxiosInstance(token).patch(
    `${GAMIFICATION_URL}/challenges/${challengeId}`,
    payload
  )
  return response.data.challenge || response.data
}

export const assignChallengeToday = async (
  challengeId: string,
  token: string,
  challengeDate?: string
): Promise<{ message: string }> => {
  if (!token) throw new Error("Unauthorized")
  const response = await AxiosInstance(token).post(
    `${GAMIFICATION_URL}/challenges/${challengeId}/assign-today`,
    { challengeDate }
  )
  return response.data
}

// Badge APIs
export const getBadges = async (
  token: string,
  params?: { skip?: number; limit?: number }
): Promise<BadgeListResponse> => {
  if (!token) throw new Error("Unauthorized")
  const response = await AxiosInstance(token).get(`${GAMIFICATION_URL}/badges`, { params })
  return response.data
}

export const createBadge = async (
  payload: BadgeCreateInput,
  token: string
): Promise<Badge> => {
  if (!token) throw new Error("Unauthorized")
  const response = await AxiosInstance(token).post(`${GAMIFICATION_URL}/badges`, payload)
  return response.data.badge || response.data
}

export const updateBadge = async (
  badgeId: string,
  payload: BadgeUpdateInput,
  token: string
): Promise<Badge> => {
  if (!token) throw new Error("Unauthorized")
  const response = await AxiosInstance(token).patch(
    `${GAMIFICATION_URL}/badges/${badgeId}`,
    payload
  )
  return response.data.badge || response.data
}

// Title APIs
export const getTitles = async (
  token: string,
  params?: { skip?: number; limit?: number }
): Promise<TitleListResponse> => {
  if (!token) throw new Error("Unauthorized")
  const response = await AxiosInstance(token).get(`${GAMIFICATION_URL}/titles`, { params })
  return response.data
}

export const createTitle = async (
  payload: TitleCreateInput,
  token: string
): Promise<Title> => {
  if (!token) throw new Error("Unauthorized")
  const response = await AxiosInstance(token).post(`${GAMIFICATION_URL}/titles`, payload)
  return response.data.title || response.data
}

export const updateTitle = async (
  titleId: string,
  payload: TitleUpdateInput,
  token: string
): Promise<Title> => {
  if (!token) throw new Error("Unauthorized")
  const response = await AxiosInstance(token).patch(
    `${GAMIFICATION_URL}/titles/${titleId}`,
    payload
  )
  return response.data.title || response.data
}

// Admin Notifications API
export const createAdminNotification = async (
  payload: AdminNotificationCreateInput,
  token: string
): Promise<AdminNotificationResponse> => {
  if (!token) throw new Error("Unauthorized")
  const response = await AxiosInstance(token).post(`${NOTIFICATIONS_URL}`, payload)
  return response.data
}
