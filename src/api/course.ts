"use client"
import AxiosInstance from "@/utils/axios";
import { COURSES_URL } from "@/constants/api";
import { courseSchemaType } from "@/schema/courseSchema";

export const createCourse = async (data: courseSchemaType, token: string) => {
    if (!token) throw new Error("Unauthorized");
    const response = await AxiosInstance(token).post(COURSES_URL, data);
    return response.data;
}

export const getCourses = async (token: string, skip = 0, limit = 10) => {
    if (!token) throw new Error("Unauthorized");
    const response = await AxiosInstance(token).get(COURSES_URL, { params: { skip, limit } });
    return response.data;
}

export const getCourseById = async (id: string, token: string) => {
    if (!token) throw new Error("Unauthorized");
    const response = await AxiosInstance(token).get(`${COURSES_URL}/${id}`);
    return response.data;
}

export const updateCourse = async (id: string, data: courseSchemaType, token: string) => {
    if (!token) throw new Error("Unauthorized");
    const response = await AxiosInstance(token).put(`${COURSES_URL}/${id}`, data);
    return response.data;
}

export const deleteCourse = async (id: string, token: string) => {
    if (!token) throw new Error("Unauthorized");
    const response = await AxiosInstance(token).delete(`${COURSES_URL}/${id}`);
    return response.data;
}




