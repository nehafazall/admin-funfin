"use client";

import { Button } from "@/components/ui/button";
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
import { FaBookOpen, FaLink } from "react-icons/fa";
import { SheetClose } from "../ui/sheet";
import { SiGoogleclassroom } from "react-icons/si";
import {
  CalendarIcon,
  Store,
  User,
  MapPin,
  Key,
  Plus,
  Link,
} from "lucide-react";
import { PiStudentFill } from "react-icons/pi";
import { format } from "date-fns";
import { cn, convertNumberToTime, convertTimeToNumber } from "@/lib/utils";
import { SelectContent, SelectItem } from "../ui/select";
import { SelectTrigger, SelectValue } from "../ui/select";
import { Select } from "../ui/select";
import { useCreateMainCourse, useEditMainCourse } from "@/hooks/useMaincourse";
import { toast } from "sonner";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";
import { maincourseSchemaType } from "@/schema/maincourseSchema";
import { GoCommentDiscussion } from "react-icons/go";
import ImageUploader from "../global/imageUploader";
import { FaClock, FaEnvelope, FaVideo } from "react-icons/fa6";
import { Switch } from "../ui/switch";
import { languages } from "@/constants/data";
// import { ICompany } from "@/types/ICompany";
interface Props {
  data?: maincourseSchemaType;
}

const MainCourseForm = ({ data }: Props) => {
  // const hook = id ? useBranch({ id }) : useBranch({});
  const {
    form,
    onFormSubmit,
    isSuccess,
    isPending,
    types,
  } = data ? useEditMainCourse(data) : useCreateMainCourse();
  const ref = useRef<any>(null);

  useEffect(() => {
    if (isSuccess && ref.current) {
      ref.current.click();
    }
  }, [isSuccess]);
  <SheetClose ref={ref} />;
  return (
    <>
      <ScrollArea className="h-[calc(100vh-100px)]">
        <Form {...form}>
          <form onSubmit={onFormSubmit} className="">
            <div className="grid mt-4  grid-cols-1 gap-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Main Course Name</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <FaBookOpen className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Enter Main Course Name"
                          className="pl-8"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Main Course Thumbnail</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <ImageUploader
                          initialImage={
                            data?.image &&
                            `${process.env.NEXT_PUBLIC_BACKEND_URL}/${field.value}`
                          }
                          onImageSelected={(url) => {
                            field.onChange(url as any);
                          }}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Main Course Description</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <GoCommentDiscussion className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Enter Main Course Description"
                          className="pl-8"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

           
          

              <div className="grid mt-4  grid-cols-1">
                <AnimatedButton
                  size="md"
                  type="submit"
                  text={data ? "update Main Course" : "create Main Course"}
                  loadingText="creating"
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

export default MainCourseForm;
