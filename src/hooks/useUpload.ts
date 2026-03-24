import { useSession } from "next-auth/react";
import { uploadImage as uploadImageApi, uploadVideo as uploadVideoApi } from "@/api/upload";
import { toast } from "sonner";

export const useImageUpload = () => {
    const { data: session } = useSession();

    const uploadImage = async (file: File): Promise<string> => {
        const token = session?.user?.token;
        if (!token) throw new Error("Unauthorized");
        const result = await uploadImageApi(file, token);
        return result.url;
    };

    return { uploadImage };
};

export const useVideoUpload = () => {
    const { data: session } = useSession();

    const uploadVideo = async (
        file: File,
        onProgress?: (pct: number) => void
    ): Promise<string> => {
        const token = session?.user?.token;
        if (!token) throw new Error("Unauthorized");
        const result = await uploadVideoApi(file, token, onProgress);
        return result.url;
    };

    return { uploadVideo };
};
