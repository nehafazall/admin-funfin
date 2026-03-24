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
import { IoAccessibilitySharp } from "react-icons/io5";
import { Input } from "@/components/ui/input";
import AnimatedButton from "../global/globalButton";
import { useEffect, useRef } from "react";
import { FaBookOpen, FaLink } from "react-icons/fa";
import { SheetClose } from "../ui/sheet";
import { IoMdBarcode } from "react-icons/io";
import { MdSettingsAccessibility } from "react-icons/md";
import { PiStudentFill } from "react-icons/pi";
import { MdEmail } from "react-icons/md";
import { ScrollArea } from "../ui/scroll-area";
import { courseSchemaType } from "@/schema/courseSchema";

import { useCreateStudent, useEditStudent } from "@/hooks/useStudents";
import { Switch } from "../ui/switch";
import { useCourse } from "@/hooks/useCourse";
import {
  Select,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectItem,
} from "../ui/select";
import { useSession } from "next-auth/react";
import { useMainCourse } from "@/hooks/useMaincourse";
// import { ICompany } from "@/types/ICompany";
interface Props {
  data?: courseSchemaType;
}

const StudentForm = ({ data }: Props) => {
  // const hook = id ? useBranch({ id }) : useBranch({});
  const { form, onFormSubmit, isSuccess, isPending } = data
    ? useEditStudent(data)
    : useCreateStudent();
  const ref = useRef<any>(null);
  const { courses } = useMainCourse();

  useEffect(() => {
    if (isSuccess && ref.current) {
      ref.current.click();
    }
  }, [isSuccess]);
  <SheetClose ref={ref} />;
  const { data: session } = useSession();
  const isSuperAdmin = session?.user?.role === "superAdmin";
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
                    <FormLabel>Student Name</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <PiStudentFill className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Enter Student Name"
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
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Student Email</FormLabel>
                    <FormControl>
                      <div className="relative ">
                        <MdEmail className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          type="email"
                          placeholder="Enter Student Email"
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
                name="buyedCourse"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Buyed Course</FormLabel>
                    <FormControl>
                      <div className="relative ">
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select Course" />
                          </SelectTrigger>
                          <SelectContent>
                            {courses?.map((course) => (
                              <SelectItem key={course._id} value={course._id}>
                                {course.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-5 gap-2">
                <div className="col-span-4">
                  <FormField
                    control={form.control}
                    name="code"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Student Code</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <IoMdBarcode className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                              disabled={true}
                              type="text"
                              placeholder="Enter Student Code"
                              className="pl-8"
                              {...field}
                              value={field.value}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="col-span-1  flex items-center justify-center flex-col md:mt-1">
                  <FormField
                    control={form.control}
                    name="isActive"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Student Active</FormLabel>
                        <FormControl>
                          <div className="relative ">
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-2">
                <FormField
                  control={form.control}
                  name="limit"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Student Limit</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <IoAccessibilitySharp className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input
                            //   disabled={true}
                            type="number"
                            placeholder="Enter Student Limit"
                            className="pl-8"
                            {...field}
                            value={field.value}
                            onChange={(e) => {
                              const value = e.target.value;
                              if (value === "") {
                                field.onChange(0);
                              } else {
                                field.onChange(Number(value));
                              }
                            }}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {isSuperAdmin && (
                  <FormField
                    control={form.control}
                    name="limitAvailable"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Student Limit Available</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <MdSettingsAccessibility className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                              //   disabled={true}
                              type="number"
                              placeholder="Enter Student Limit Available"
                              className="pl-8"
                              {...field}
                              value={field.value}
                              onChange={(e) => {
                                const value = e.target.value;
                                if (value === "") {
                                  field.onChange(0);
                                } else {
                                  field.onChange(Number(value));
                                }
                              }}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </div>

              <div className="grid mt-4  grid-cols-1">
                <AnimatedButton
                  size="md"
                  type="submit"
                  text={data ? "update Course" : "create Course"}
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

export default StudentForm;
