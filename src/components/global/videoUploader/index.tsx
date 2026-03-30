"use client";

import type React from "react";
import { useRef, useState } from "react";
import { Upload, X, Loader2, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface VideoUploaderProps {
  /** Current video URL (from react-hook-form field.value) */
  value?: string | null;
  /** Called with the Cloudinary URL after a successful upload, or null when cleared */
  onChange: (url: string | null) => void;
  /** Async function that uploads the File and returns the final URL */
  onUploadFile?: (file: File, onProgress: (pct: number) => void) => Promise<string>;
  className?: string;
}

export default function VideoUploader({
  value,
  onChange,
  onUploadFile,
  className,
}: VideoUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [localPreview, setLocalPreview] = useState<string | null>(null);

  const displayUrl = value || localPreview;

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files?.[0]) handleVideoFile(e.dataTransfer.files[0]);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) handleVideoFile(e.target.files[0]);
  };

  const handleVideoFile = async (file: File) => {
    if (!file.type.match("video.*")) {
      toast.error("Please select a video file");
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setLocalPreview(objectUrl);

    if (!onUploadFile) {
      onChange(objectUrl);
      return;
    }

    setIsUploading(true);
    setProgress(0);
    try {
      const url = await onUploadFile(file, (pct) => setProgress(pct));
      setLocalPreview(null);
      URL.revokeObjectURL(objectUrl);
      onChange(url);
      toast.success("Video uploaded successfully");
    } catch (err: any) {
      setLocalPreview(null);
      URL.revokeObjectURL(objectUrl);
      toast.error(err?.message ?? "Video upload failed");
    } finally {
      setIsUploading(false);
      setProgress(0);
    }
  };

  const clearVideo = () => {
    setLocalPreview(null);
    onChange(null);
  };

  return (
    <div className={cn("w-full", className)}>
      {!displayUrl ? (
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
              <p className="text-sm text-muted-foreground">Uploading video... {progress}%</p>
              <Progress value={progress} className="w-full max-w-xs" />
            </div>
          ) : (
            <>
              <Video className="h-10 w-10 text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground text-center mb-2">
                Drag and drop a video, or click to browse
              </p>
              <p className="text-xs text-muted-foreground/70 mb-2">
                Supported: MP4, MOV, AVI, WebM (max 500MB)
              </p>
              <Input
                ref={fileInputRef}
                type="file"
                accept="video/*"
                onChange={handleFileChange}
                className="hidden"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
              >
                Select Video
              </Button>
            </>
          )}
        </div>
      ) : (
        <div className="relative">
          <div className="relative w-full bg-muted-foreground/5 p-1 border-input border rounded-md overflow-hidden">
            <video
              src={displayUrl}
              controls
              className="w-full max-h-48 rounded-md object-contain"
            />
            {isUploading && (
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
            className="absolute top-2 right-2 h-8 w-8 z-10"
            onClick={clearVideo}
            disabled={isUploading}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
