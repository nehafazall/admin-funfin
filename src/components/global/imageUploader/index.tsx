"use client";

import type React from "react";
import { useState } from "react";
import { Upload, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface ImageUploaderProps {
  /** Current image URL (from react-hook-form field.value) */
  value?: string | null;
  /** Called with the Cloudinary URL after a successful upload, or null when cleared */
  onChange: (url: string | null) => void;
  /** Async function that uploads the File and returns the final URL */
  onUploadFile?: (file: File) => Promise<string>;
  className?: string;
}

export default function ImageUploader({
  value,
  onChange,
  onUploadFile,
  className,
}: ImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [localPreview, setLocalPreview] = useState<string | null>(null);

  // Show the Cloudinary URL if available, otherwise show local blob preview
  const displayUrl = value || localPreview;

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files?.[0]) handleImageFile(e.dataTransfer.files[0]);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) handleImageFile(e.target.files[0]);
  };

  const handleImageFile = async (file: File) => {
    if (!file.type.match("image.*")) {
      toast.error("Please select an image file");
      return;
    }

    // Show local blob preview immediately for responsiveness
    const objectUrl = URL.createObjectURL(file);
    setLocalPreview(objectUrl);

    if (!onUploadFile) {
      // No upload handler — pass blob URL (useful for preview-only scenarios)
      onChange(objectUrl);
      return;
    }

    setIsUploading(true);
    try {
      const url = await onUploadFile(file);
      setLocalPreview(null);
      URL.revokeObjectURL(objectUrl);
      onChange(url);
      toast.success("Image uploaded successfully");
    } catch (err: any) {
      setLocalPreview(null);
      URL.revokeObjectURL(objectUrl);
      toast.error(err?.message ?? "Image upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  const clearImage = () => {
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
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="h-10 w-10 text-muted-foreground animate-spin" />
              <p className="text-sm text-muted-foreground">Uploading image...</p>
            </div>
          ) : (
            <>
              <Upload className="h-10 w-10 text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground text-center mb-2">
                Drag and drop an image, or click to browse
              </p>
              <Input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                id="image-upload"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => document.getElementById("image-upload")?.click()}
              >
                Select Image
              </Button>
            </>
          )}
        </div>
      ) : (
        <div className="relative">
          <div className="relative w-full flex items-center bg-muted-foreground/5 p-1 border-input border justify-center h-48 rounded-md overflow-hidden">
            <img
              src={displayUrl}
              alt="Preview"
              className="h-full rounded-md object-cover"
            />
            {isUploading && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-md">
                <Loader2 className="h-8 w-8 text-white animate-spin" />
              </div>
            )}
          </div>
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2 h-8 w-8"
            onClick={clearImage}
            disabled={isUploading}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
