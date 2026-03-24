import AxiosInstance from "@/utils/axios";

export const uploadImage = async (file: File, token: string): Promise<{ url: string; public_id: string }> => {
  if (!token) throw new Error("Unauthorized");
  const formData = new FormData();
  formData.append("file", file);
  const response = await AxiosInstance(token).post("/api/v1/uploads/image", formData);
  return response.data;
};

export const uploadVideo = async (
  file: File,
  token: string,
  onUploadProgress?: (pct: number) => void
): Promise<{ url: string; public_id: string }> => {
  if (!token) throw new Error("Unauthorized");
  const formData = new FormData();
  formData.append("file", file);
  const response = await AxiosInstance(token).post("/api/v1/uploads/video", formData, {
    onUploadProgress: (e) => {
      if (onUploadProgress && e.total) {
        onUploadProgress(Math.round((e.loaded * 100) / e.total));
      }
    },
  });
  return response.data;
};
