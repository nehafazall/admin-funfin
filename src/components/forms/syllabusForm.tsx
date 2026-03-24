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
import { useCreateSyllabus, useEditSyllabus } from "@/hooks/useSyllabus";
import { useImageUpload } from "@/hooks/useUpload";
import ImageUploader from "../global/imageUploader";
import { ISyllabus } from "@/types/ISyllabus";

interface Props {
  courseId: string;
  data?: ISyllabus;
}

const SyllabusForm = ({ courseId, data }: Props) => {
  const { form, onFormSubmit, isSuccess, isPending } = data
    ? useEditSyllabus(data)
    : useCreateSyllabus(courseId);
  const { uploadImage } = useImageUpload();
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
                    <FormLabel>Syllabus Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter syllabus title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="moduleLabel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Module Label</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Module 1" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="coverImage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cover Image (optional)</FormLabel>
                    <FormControl>
                      <ImageUploader
                        value={field.value ?? null}
                        onChange={(url) => field.onChange(url ?? undefined)}
                        onUploadFile={uploadImage}
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
                  text={data ? "Update Syllabus" : "Create Syllabus"}
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

export default SyllabusForm;
