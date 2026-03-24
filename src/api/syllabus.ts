"use client"
import AxiosInstance from "@/utils/axios";
import { SYLLABUSES_URL } from "@/constants/api";
import { syllabusSchemaType } from "@/schema/syllabusSchema";

export const getSyllabuses = async (courseId: string, token: string, skip = 0, limit = 10) => {
    if (!token) throw new Error("Unauthorized");
    const response = await AxiosInstance(token).get(SYLLABUSES_URL, { params: { courseId, skip, limit } });
    return response.data;
}

export const getSyllabusById = async (id: string, token: string) => {
    if (!token) throw new Error("Unauthorized");
    const response = await AxiosInstance(token).get(`${SYLLABUSES_URL}/${id}`);
    return response.data;
}

export const createSyllabus = async (data: syllabusSchemaType, token: string) => {
    if (!token) throw new Error("Unauthorized");
    const response = await AxiosInstance(token).post(SYLLABUSES_URL, data);
    return response.data;
}

export const updateSyllabus = async (id: string, data: Partial<syllabusSchemaType>, token: string) => {
    if (!token) throw new Error("Unauthorized");
    const response = await AxiosInstance(token).put(`${SYLLABUSES_URL}/${id}`, data);
    return response.data;
}

export const deleteSyllabus = async (id: string, token: string) => {
    if (!token) throw new Error("Unauthorized");
    const response = await AxiosInstance(token).delete(`${SYLLABUSES_URL}/${id}`);
    return response.data;
}
