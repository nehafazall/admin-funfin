"use client";
import PageContainer from "@/components/layout/page-container";
import { buttonVariants } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";
import { SheetReuse } from "@/components/global/sheet";
import { useState } from "react";
import UserList from "@/components/table/user/userList";
import UserForm from "@/components/forms/userForm";

export default function Page() {
  const [create, setCreate] = useState(false);
  const closeSheet = () => setCreate(false);
  const openSheet = () => setCreate(true);

  return (
    <>
      <SheetReuse
        className="w-full md:w-full"
        title="Create Admin"
        description="Add a new admin, mentor, or counselor"
        open={create}
        closeFn={closeSheet}
      >
        <UserForm />
      </SheetReuse>
      <PageContainer scrollable={true}>
        <div className="flex flex-1 flex-col space-y-4">
          <div className="flex items-start justify-between">
            <Heading
              title="Admins"
              description="Manage admin users and their roles"
            />
            <div
              onClick={openSheet}
              className={cn(
                buttonVariants(),
                "text-xs shadow-lg shadow-primary/20 md:text-sm hover:opacity-90 transition-all active:scale-[.9] duration-[.3s] ease-in-out border-0"
              )}
            >
              <Plus className="mr-2 h-4 w-4" /> Add New
            </div>
          </div>
          <Separator />
          <UserList />
        </div>
      </PageContainer>
    </>
  );
}
