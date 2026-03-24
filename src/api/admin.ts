"use client"
import AxiosInstance from "@/utils/axios";
import { ADMINS_URL } from "@/constants/api";
import { adminSchemaType } from "@/schema/adminSchema";

export const getAdmins = async (token: string, skip = 0, limit = 10) => {
    if (!token) throw new Error("Unauthorized");
    const response = await AxiosInstance(token).get(ADMINS_URL, { params: { skip, limit } });
    return response.data;
}

export const getAdminById = async (id: string, token: string) => {
    if (!token) throw new Error("Unauthorized");
    const response = await AxiosInstance(token).get(`${ADMINS_URL}/${id}`);
    return response.data;
}

export const createAdmin = async (data: adminSchemaType, token: string) => {
    if (!token) throw new Error("Unauthorized");
    const response = await AxiosInstance(token).post(ADMINS_URL, data);
    return response.data;
}

export const updateAdmin = async (id: string, data: Partial<adminSchemaType>, token: string) => {
    if (!token) throw new Error("Unauthorized");
    const response = await AxiosInstance(token).put(`${ADMINS_URL}/${id}`, data);
    return response.data;
}

export const deleteAdmin = async (id: string, token: string) => {
    if (!token) throw new Error("Unauthorized");
    const response = await AxiosInstance(token).delete(`${ADMINS_URL}/${id}`);
    return response.data;
}
