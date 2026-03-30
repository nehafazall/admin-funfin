import AxiosInstance from "@/utils/axios";
import axios from "axios";

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

  // Step 1: get a pre-signed PUT URL from our backend (tiny request — no nginx size issue)
  const ext = file.name.includes(".") ? `.${file.name.split(".").pop()}` : ".mp4";
  const { data } = await AxiosInstance(token).get<{ presignedUrl: string; publicUrl: string; key: string }>(
    `/api/v1/uploads/video-presign`,
    { params: { ext, mime: file.type || "video/mp4" } }
  );

  // Step 2: PUT the file directly to R2 — completely bypasses nginx
  await axios.put(data.presignedUrl, file, {
    headers: { "Content-Type": file.type || "video/mp4" },
    onUploadProgress: (e) => {
      if (onUploadProgress && e.total) {
        onUploadProgress(Math.round((e.loaded * 100) / e.total));
      }
    },
  });

  return { url: data.publicUrl, public_id: data.key };
};
