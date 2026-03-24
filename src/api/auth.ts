"use client"
import { ADMIN_AUTH_URL } from "@/constants/api"
import AxiosInstance from "@/utils/axios"

export const login = async (data: { email: string, password: string }) => {
    const response = await AxiosInstance().post(`${ADMIN_AUTH_URL}/login`, { email: data.email, password: data.password });
    return response.data
}
