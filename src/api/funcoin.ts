"use client"

import { FUNCOIN_URL } from "@/constants/api"
import {
  FuncoinAdminPurchaseListResponse,
  FuncoinAdminPurchaseQueryParams,
  FuncoinCategory,
  FuncoinCategoryCreateInput,
  FuncoinCategoryListResponse,
  FuncoinCategoryUpdateInput,
  FuncoinPriceUpdateInput,
  FuncoinPricing,
  FuncoinTransactionCreateInput,
  FuncoinTransactionCreateResponse,
  FuncoinTransactionListResponse,
  FuncoinTransactionQueryParams,
} from "@/types/IFuncoin"
import AxiosInstance from "@/utils/axios"

export const getFuncoinPrice = async (token: string): Promise<FuncoinPricing> => {
  if (!token) throw new Error("Unauthorized")
  const response = await AxiosInstance(token).get(`${FUNCOIN_URL}/price`)
  return response.data
}

export const updateFuncoinPrice = async (
  payload: FuncoinPriceUpdateInput,
  token: string
): Promise<FuncoinPricing> => {
  if (!token) throw new Error("Unauthorized")
  const response = await AxiosInstance(token).patch(`${FUNCOIN_URL}/price`, payload)
  return response.data
}

export const getFuncoinCategories = async (
  token: string,
  kind?: "earn" | "spend"
): Promise<FuncoinCategoryListResponse> => {
  if (!token) throw new Error("Unauthorized")
  const response = await AxiosInstance(token).get(`${FUNCOIN_URL}/categories`, {
    params: kind ? { kind } : undefined,
  })
  return response.data
}

export const createFuncoinCategory = async (
  payload: FuncoinCategoryCreateInput,
  token: string
): Promise<FuncoinCategory> => {
  if (!token) throw new Error("Unauthorized")
  const response = await AxiosInstance(token).post(`${FUNCOIN_URL}/categories`, payload)
  return response.data
}

export const updateFuncoinCategory = async (
  categoryCode: string,
  payload: FuncoinCategoryUpdateInput,
  token: string
): Promise<FuncoinCategory> => {
  if (!token) throw new Error("Unauthorized")
  const response = await AxiosInstance(token).patch(
    `${FUNCOIN_URL}/categories/${categoryCode}`,
    payload
  )
  return response.data
}

export const createFuncoinTransaction = async (
  payload: FuncoinTransactionCreateInput,
  token: string
): Promise<FuncoinTransactionCreateResponse> => {
  if (!token) throw new Error("Unauthorized")
  const response = await AxiosInstance(token).post(`${FUNCOIN_URL}/transactions`, payload)
  return response.data
}

export const getFuncoinTransactions = async (
  token: string,
  params: FuncoinTransactionQueryParams
): Promise<FuncoinTransactionListResponse> => {
  if (!token) throw new Error("Unauthorized")
  const response = await AxiosInstance(token).get(`${FUNCOIN_URL}/transactions`, { params })
  return response.data
}

export const getFuncoinPurchases = async (
  token: string,
  params: FuncoinAdminPurchaseQueryParams
): Promise<FuncoinAdminPurchaseListResponse> => {
  if (!token) throw new Error("Unauthorized")
  const response = await AxiosInstance(token).get(`${FUNCOIN_URL}/purchases`, { params })
  return response.data
}
