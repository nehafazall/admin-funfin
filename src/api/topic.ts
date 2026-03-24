"use client"
import AxiosInstance from "@/utils/axios";
import { TOPICS_URL } from "@/constants/api";
import { topicSchemaType } from "@/schema/topicSchema";

export const getTopics = async (syllabusId: string, token: string, skip = 0, limit = 10) => {
    if (!token) throw new Error("Unauthorized");
    const response = await AxiosInstance(token).get(TOPICS_URL, { params: { syllabusId, skip, limit } });
    return response.data;
}

export const getTopicById = async (id: string, token: string) => {
    if (!token) throw new Error("Unauthorized");
    const response = await AxiosInstance(token).get(`${TOPICS_URL}/${id}`);
    return response.data;
}

export const createTopic = async (data: topicSchemaType, token: string) => {
    if (!token) throw new Error("Unauthorized");
    const response = await AxiosInstance(token).post(TOPICS_URL, data);
    return response.data;
}

export const updateTopic = async (id: string, data: Partial<topicSchemaType>, token: string) => {
    if (!token) throw new Error("Unauthorized");
    const response = await AxiosInstance(token).put(`${TOPICS_URL}/${id}`, data);
    return response.data;
}

export const deleteTopic = async (id: string, token: string) => {
    if (!token) throw new Error("Unauthorized");
    const response = await AxiosInstance(token).delete(`${TOPICS_URL}/${id}`);
    return response.data;
}
