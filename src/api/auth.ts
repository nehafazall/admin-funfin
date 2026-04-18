"use client"
import { ADMIN_AUTH_URL } from "@/constants/api"
import AxiosInstance from "@/utils/axios"
import { AdminBootstrapInput, AdminBootstrapResponse, AdminProfileResponse } from "@/types/IAdminAuth"

export const login = async (data: { email: string, password: string }) => {
    const response = await AxiosInstance().post(`${ADMIN_AUTH_URL}/login`, { email: data.email, password: data.password });
    return response.data
}

export const getAdminProfile = async (token: string): Promise<AdminProfileResponse> => {
    if (!token) throw new Error("Unauthorized")
    const response = await AxiosInstance(token).get(`${ADMIN_AUTH_URL}/profile`)
    return response.data
}

export const bootstrapSuperadmin = async (data: AdminBootstrapInput): Promise<AdminBootstrapResponse> => {
    const response = await AxiosInstance().post(`${ADMIN_AUTH_URL}/bootstrap-superadmin`, data)
    return response.data
}
