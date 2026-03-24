"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { IoLockClosed } from "react-icons/io5";
import { Input } from "@/components/ui/input";
import AnimatedButton from "../global/globalButton";
import { useEffect, useRef } from "react";
import { SheetClose } from "../ui/sheet";
import { PiStudentFill } from "react-icons/pi";
import { MdEmail } from "react-icons/md";
import { ScrollArea } from "../ui/scroll-area";
import { useCreateUser, useEditUser } from "@/hooks/useAdmin";
import { Switch } from "../ui/switch";
import {
  Select,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectItem,
} from "../ui/select";
import { IUser } from "@/types/IUser";

interface Props {
  data?: IUser;
}

const UserForm = ({ data }: Props) => {
  const { form, onFormSubmit, isSuccess, isPending } = data
    ? useEditUser(data)
    : useCreateUser();
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
          <form onSubmit={onFormSubmit} className="">
            <div className="grid mt-4 grid-cols-1 gap-y-6">
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <PiStudentFill className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input placeholder="Enter Full Name" className="pl-8" {...field} />
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
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <MdEmail className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input type="email" placeholder="Enter Email" className="pl-8" {...field} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role</FormLabel>
                    <FormControl>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Role" />
                        </SelectTrigger>
                        <SelectContent>
                          {["admin", "mentor", "counsilor"].map((role) => (
                            <SelectItem key={role} value={role}>
                              {role.charAt(0).toUpperCase() + role.slice(1)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <IoLockClosed className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input type="password" placeholder="Enter Password" className="pl-8" {...field} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem className="flex items-center gap-3">
                    <FormLabel className="mt-2">Active</FormLabel>
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
                  text={data ? "Update Admin" : "Create Admin"}
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

export default UserForm;
