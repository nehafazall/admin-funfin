"use client";
import PageContainer from "@/components/layout/page-container";
import { buttonVariants } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";
import { SearchParams } from "nuqs/server";
import { SheetReuse } from "@/components/global/sheet";
import { useState } from "react";
import CourseForm from "@/components/forms/courseForm";
import CourseList from "@/components/table/course/courselist";
type pageProps = {
  searchParams: Promise<SearchParams>;
};

export default function Page(props: pageProps) {
  const [create, setcreate] = useState(false);
  const closeSheet = () => setcreate(false);
  const openSheet = () => setcreate(true);
  return (
    <>
      <SheetReuse
        className="w-full md:w-full"
        title="Create Course 📜"
        description="create course and add fields"
        open={create}
        closeFn={closeSheet}
      >
        <CourseForm />
      </SheetReuse>
      <PageContainer scrollable={true}>
        <div className="flex flex-1 flex-col space-y-4">
          <div className="flex items-start justify-between">
            <Heading
              title="Course📜"
              description="Course Listing And Actions "
            />
            <div
              onClick={openSheet}
              className={cn(
                buttonVariants(),
                "text-xs  shadow-lg shadow-primary/20  md:text-sm  hover:opacity-90 transition-all active:scale-[.9] duration-[.3s] ease-in-out border-0 "
              )}
            >
              <Plus className="mr-2 h-4 w-4" /> Add New
            </div>
          </div>
          <Separator />
          <CourseList />
        </div>
      </PageContainer>
    </>
  );
}
