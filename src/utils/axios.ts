import axios from "axios";
import { signOut } from "next-auth/react";

// Prevent multiple simultaneous signOut calls when several requests return 401.
let isSigningOut = false;

const AxiosInstance = (token?: string) => {
  const instance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
    withCredentials: true,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  // ── Request interceptor: inject pagination params on GET ──────────────────
  instance.interceptors.request.use((config) => {
    if (typeof window !== "undefined" && config.method === "get") {
      const params = new URLSearchParams(window.location.search);
      const offset = params.get("skip");
      const skip = offset;
      const limit = params.get("limit");
      const page = Number(skip) / Number(limit) + 1;

      config.params = {
        ...(offset && { offset, skip }),
        ...(limit && { limit }),
        ...(page && { page }),
        ...config.params,
      };
    }
    return config;
  });

  // ── Response interceptor: auto sign-out on 401 ───────────────────────────
  instance.interceptors.response.use(
    (response) => response,
    async (error) => {
      console.error("[API Error]", {
        method: error?.config?.method,
        url: error?.config?.url,
        status: error?.response?.status,
        data: error?.response?.data,
        message: error?.message,
      });

      if (error.response?.status === 401 && !isSigningOut) {
        isSigningOut = true;
        await signOut({ callbackUrl: "/auth/login", redirect: true });
      }
      return Promise.reject(error);
    },
  );

  return instance;
};

export default AxiosInstance;
