"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import AnimatedButton from "../global/globalButton";
import { useEffect, useRef, useCallback, useState } from "react";
import { useWatch } from "react-hook-form";
import { useSession } from "next-auth/react";
import { SheetClose } from "../ui/sheet";
import { ScrollArea } from "../ui/scroll-area";
import { courseSchemaType } from "@/schema/courseSchema";
import { Switch } from "../ui/switch";
import { useCreateCourse, useEditCourse } from "@/hooks/useCourse";
import { uploadImage as uploadImageApi, uploadVideo as uploadVideoApi } from "@/api/upload";
import MediaUploader from "../global/mediaUploader";
import { FaBookOpen, FaClock, FaStar } from "react-icons/fa";
import { GoCommentDiscussion } from "react-icons/go";

const EMPTY_COURSE: courseSchemaType = {
  title: "",
  photo: "",
  description: "",
  duration: "",
  isPublished: false,
};

interface Props {
  data?: courseSchemaType;
}

const CourseForm = ({ data }: Props) => {
  const isEditMode = !!data;

  // Always call both hooks unconditionally (Rules of Hooks)
  const createHook = useCreateCourse();
  const editHook = useEditCourse(data ?? EMPTY_COURSE);

  const { form, onFormSubmit, isSuccess, isPending } = isEditMode ? editHook : createHook;
  const { data: session } = useSession();
  const ref = useRef<any>(null);
  const [isMediaUploading, setIsMediaUploading] = useState(false);

  const handleUploadImage = useCallback(async (file: File): Promise<string> => {
    const token = session?.user?.token;
    if (!token) throw new Error("Session expired — please refresh and log in again.");
    const result = await uploadImageApi(file, token);
    return result.url;
  }, [session?.user?.token]);

  const handleUploadVideo = useCallback(async (file: File, onProgress: (pct: number) => void): Promise<string> => {
    const token = session?.user?.token;
    if (!token) throw new Error("Session expired — please refresh and log in again.");
    const result = await uploadVideoApi(file, token, onProgress);
    return result.url;
  }, [session?.user?.token]);

  const photoValue = useWatch({ control: form.control, name: "photo" });
  const videoUrlValue = useWatch({ control: form.control, name: "videoUrl" });

  useEffect(() => {
    if (isSuccess && ref.current) {
      ref.current.click();
    }
  }, [isSuccess]);

  return (
    <>
      <ScrollArea className="h-[calc(100vh-100px)]">
        <Form {...form}>
          <form onSubmit={onFormSubmit}>
            <div className="grid mt-4 grid-cols-1 gap-y-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Course Title</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <FaBookOpen className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input placeholder="Enter Course Title" className="pl-8" {...field} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Unified image + video uploader */}
              <FormItem>
                <FormLabel>Course Media</FormLabel>
                <FormControl>
                  <MediaUploader
                    imageValue={photoValue || null}
                    videoValue={videoUrlValue || null}
                    onImageChange={(url) => form.setValue("photo", url ?? "", { shouldValidate: true })}
                    onVideoChange={(url) => form.setValue("videoUrl", url ?? "", { shouldValidate: true })}
                    onUploadImage={handleUploadImage}
                    onUploadVideo={handleUploadVideo}
                    onUploadingChange={setIsMediaUploading}
                  />
                </FormControl>
                <FormMessage>{form.formState.errors.photo?.message}</FormMessage>
              </FormItem>

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <GoCommentDiscussion className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input placeholder="Enter Description" className="pl-8" {...field} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="duration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Duration</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <FaClock className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input placeholder="e.g. 8 weeks" className="pl-8" {...field} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="rating"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Rating (0-5)</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <FaStar className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input
                            type="number"
                            min={0}
                            max={5}
                            step={0.1}
                            placeholder="4.5"
                            className="pl-8"
                            {...field}
                            value={field.value ?? ""}
                            onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="totalModules"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Total Modules</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={0}
                          placeholder="12"
                          {...field}
                          value={field.value ?? ""}
                          onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="isPublished"
                render={({ field }) => (
                  <FormItem className="flex items-center gap-3">
                    <FormLabel className="mt-2">Published</FormLabel>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid mt-4 grid-cols-1">
                <AnimatedButton
                  size="md"
                  type="submit"
                  text={isEditMode ? "Update Course" : "Create Course"}
                  loadingText="Saving..."
                  isLoading={isPending}
                  disabled={isMediaUploading}
                />
              </div>
            </div>
          </form>
          <SheetClose ref={ref} />
        </Form>
      </ScrollArea>
    </>
  );
};

export default CourseForm;
