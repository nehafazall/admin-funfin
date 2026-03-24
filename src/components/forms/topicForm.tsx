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
import { useEffect, useRef } from "react";
import { SheetClose } from "../ui/sheet";
import { ScrollArea } from "../ui/scroll-area";
import { useCreateTopic, useEditTopic } from "@/hooks/useTopic";
import { useVideoUpload } from "@/hooks/useUpload";
import VideoUploader from "../global/videoUploader";
import { ITopic } from "@/types/ITopic";

interface Props {
  syllabusId: string;
  courseId: string;
  data?: ITopic;
}

const TopicForm = ({ syllabusId, courseId, data }: Props) => {
  const { form, onFormSubmit, isSuccess, isPending } = data
    ? useEditTopic(data)
    : useCreateTopic(syllabusId, courseId);
  const { uploadVideo } = useVideoUpload();
  const ref = useRef<any>(null);

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
                    <FormLabel>Topic Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter topic title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="videoUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Topic Video</FormLabel>
                    <FormControl>
                      <VideoUploader
                        value={field.value}
                        onChange={(url) => field.onChange(url ?? "")}
                        onUploadFile={(file, onProgress) => uploadVideo(file, onProgress)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="overview"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Overview</FormLabel>
                    <FormControl>
                      <Input placeholder="Brief overview of the topic..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="order"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Order (optional)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={0}
                        placeholder="1"
                        {...field}
                        onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid mt-4 grid-cols-1">
                <AnimatedButton
                  size="md"
                  type="submit"
                  text={data ? "Update Topic" : "Create Topic"}
                  loadingText="Saving..."
                  isLoading={isPending}
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

export default TopicForm;
