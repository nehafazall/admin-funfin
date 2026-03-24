"use client";

import type React from "react";
import { useRef, useState } from "react";
import { Upload, X, Loader2, Video, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

type MediaType = "image" | "video";

interface MediaUploaderProps {
  imageValue?: string | null;
  videoValue?: string | null;
  onImageChange: (url: string | null) => void;
  onVideoChange: (url: string | null) => void;
  onUploadImage?: (file: File) => Promise<string>;
  onUploadVideo?: (file: File, onProgress: (pct: number) => void) => Promise<string>;
  /** Called whenever an upload starts (true) or finishes/fails (false) */
  onUploadingChange?: (uploading: boolean) => void;
  className?: string;
}

export default function MediaUploader({
  imageValue,
  videoValue,
  onImageChange,
  onVideoChange,
  onUploadImage,
  onUploadVideo,
  onUploadingChange,
  className,
}: MediaUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadingType, setUploadingType] = useState<MediaType | null>(null);
  const [progress, setProgress] = useState(0);
  const [localPreview, setLocalPreview] = useState<{ url: string; type: MediaType } | null>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  const hasImage = imageValue || (localPreview?.type === "image" ? localPreview.url : null);
  const hasVideo = videoValue || (localPreview?.type === "video" ? localPreview.url : null);
  const displayImage = imageValue || (localPreview?.type === "image" ? localPreview.url : null);
  const displayVideo = videoValue || (localPreview?.type === "video" ? localPreview.url : null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    if (file.type.startsWith("image/")) {
      handleImageFile(file);
    } else if (file.type.startsWith("video/")) {
      handleVideoFile(file);
    } else {
      toast.error("Unsupported file type. Please drop an image or video.");
    }
  };

  const handleImageFile = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }
    const objectUrl = URL.createObjectURL(file);
    setLocalPreview({ url: objectUrl, type: "image" });

    if (!onUploadImage) {
      onImageChange(objectUrl);
      return;
    }

    setIsUploading(true);
    setUploadingType("image");
    onUploadingChange?.(true);
    try {
      const url = await onUploadImage(file);
      setLocalPreview(null);
      URL.revokeObjectURL(objectUrl);
      onImageChange(url);
      toast.success("Image uploaded successfully");
    } catch (err: any) {
      setLocalPreview(null);
      URL.revokeObjectURL(objectUrl);
      toast.error(err?.message ?? "Image upload failed");
    } finally {
      setIsUploading(false);
      setUploadingType(null);
      onUploadingChange?.(false);
    }
  };

  const handleVideoFile = async (file: File) => {
    if (!file.type.startsWith("video/")) {
      toast.error("Please select a video file");
      return;
    }
    const objectUrl = URL.createObjectURL(file);
    setLocalPreview({ url: objectUrl, type: "video" });

    if (!onUploadVideo) {
      onVideoChange(objectUrl);
      return;
    }

    setIsUploading(true);
    setUploadingType("video");
    setProgress(0);
    onUploadingChange?.(true);
    try {
      const url = await onUploadVideo(file, (pct) => setProgress(pct));
      setLocalPreview(null);
      URL.revokeObjectURL(objectUrl);
      onVideoChange(url);
      toast.success("Video uploaded successfully");
    } catch (err: any) {
      setLocalPreview(null);
      URL.revokeObjectURL(objectUrl);
      toast.error(err?.message ?? "Video upload failed");
    } finally {
      setIsUploading(false);
      setUploadingType(null);
      setProgress(0);
      onUploadingChange?.(false);
    }
  };

  const clearImage = () => {
    setLocalPreview(null);
    onImageChange(null);
  };

  const clearVideo = () => {
    setLocalPreview(null);
    onVideoChange(null);
  };

  return (
    <div className={cn("w-full space-y-3", className)}>
      {/* Hidden file inputs — always mounted so refs are always valid */}
      <input
        ref={imageInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => { if (e.target.files?.[0]) { handleImageFile(e.target.files[0]); e.target.value = ""; } }}
      />
      <input
        ref={videoInputRef}
        type="file"
        accept="video/mp4,video/quicktime,video/webm,video/x-msvideo,video/x-matroska"
        className="hidden"
        onChange={(e) => { if (e.target.files?.[0]) { handleVideoFile(e.target.files[0]); e.target.value = ""; } }}
      />

      {/* Drop zone — shown when neither image nor video is present */}
      {!hasImage && !hasVideo && (
        <div
          className={cn(
            "border border-input rounded-md p-6 flex flex-col items-center justify-center bg-muted-foreground/5 cursor-pointer",
            isDragging ? "border-primary bg-primary/5" : "border-muted-foreground/25"
          )}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {isUploading ? (
            <div className="flex flex-col items-center gap-3 w-full">
              <Loader2 className="h-10 w-10 text-muted-foreground animate-spin" />
              <p className="text-sm text-muted-foreground">
                Uploading {uploadingType}
                {uploadingType === "video" ? `... ${progress}%` : "..."}
              </p>
              {uploadingType === "video" && (
                <Progress value={progress} className="w-full max-w-xs" />
              )}
            </div>
          ) : (
            <>
              <Upload className="h-10 w-10 text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground text-center mb-1">
                Drag and drop a file, or choose below
              </p>
              <p className="text-xs text-muted-foreground/70 mb-4 text-center">
                Images: JPG, PNG, WebP &nbsp;|&nbsp; Videos: MP4, MOV, WebM (max 500MB)
              </p>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => imageInputRef.current?.click()}
                >
                  <ImageIcon className="h-4 w-4 mr-1" />
                  Select Image
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => videoInputRef.current?.click()}
                >
                  <Video className="h-4 w-4 mr-1" />
                  Select Video
                </Button>
              </div>
            </>
          )}
        </div>
      )}

      {/* Image preview */}
      {hasImage && (
        <div className="relative">
          <p className="text-xs font-medium text-muted-foreground mb-1 flex items-center gap-1">
            <ImageIcon className="h-3 w-3" /> Course Image
          </p>
          <div className="relative w-full flex items-center bg-muted-foreground/5 p-1 border-input border justify-center h-48 rounded-md overflow-hidden">
            <img
              src={displayImage!}
              alt="Course image preview"
              className="h-full rounded-md object-cover"
            />
            {isUploading && uploadingType === "image" && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-md">
                <Loader2 className="h-8 w-8 text-white animate-spin" />
              </div>
            )}
          </div>
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute top-6 right-2 h-8 w-8"
            onClick={clearImage}
            disabled={isUploading}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Video preview */}
      {hasVideo && (
        <div className="relative">
          <p className="text-xs font-medium text-muted-foreground mb-1 flex items-center gap-1">
            <Video className="h-3 w-3" /> Course Video
          </p>
          <div className="relative w-full bg-muted-foreground/5 p-1 border-input border rounded-md overflow-hidden">
            <video
              src={displayVideo!}
              controls
              className="w-full max-h-48 rounded-md object-contain"
            />
            {isUploading && uploadingType === "video" && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 rounded-md gap-2">
                <Loader2 className="h-8 w-8 text-white animate-spin" />
                <p className="text-white text-sm">{progress}%</p>
                <Progress value={progress} className="w-3/4" />
              </div>
            )}
          </div>
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute top-6 right-2 h-8 w-8 z-10"
            onClick={clearVideo}
            disabled={isUploading}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Add more files buttons when at least one file is already uploaded */}
      {(hasImage || hasVideo) && !isUploading && (
        <div className="flex gap-2 flex-wrap">
          {!hasImage && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => imageInputRef.current?.click()}
            >
              <ImageIcon className="h-4 w-4 mr-1" />
              Add Image
            </Button>
          )}
          {!hasVideo && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => videoInputRef.current?.click()}
            >
              <Video className="h-4 w-4 mr-1" />
              Add Video
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
