"use client";

import * as React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "@/components/global/cell-actions";
// import BrandEditForm from "@/components/forms/brandEditForm";
// import { useDltBrand } from "@/hooks/useBrand";
import { Button, buttonVariants } from "@/components/ui/button";
import { ClockIcon, Copy, PlusIcon, UserIcon } from "lucide-react";
import SchemaForm from "@/components/forms/courseForm";
import { ImEmbed2 } from "react-icons/im";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Dialog } from "@/components/ui/dialog";
import SchemaInfo from "@/components/global/orderInfo";
import { cn, convertNumberToTime } from "@/lib/utils";
import { useDeleteCourse } from "@/hooks/useCourse";
import { IMainCourse } from "@/types/IMaincourse";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { SiGoogleclassroom } from "react-icons/si";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MainCourseForm from "@/components/forms/maincourseForm";
import { useDeleteMainCourse } from "@/hooks/useMaincourse";
// import { useDeleteBranch } from "@/hooks/useBranch";
export type Cloumn = IMainCourse;

export const columns: ColumnDef<Cloumn>[] = [
  {
    accessorKey: "rowNumber",
    header: "#",
    cell: ({ row }) => <div>{row.index + 1}</div>,
  },
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => <div>{row.getValue("name")}</div>,
  },

  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => (
      <div>
        {row.getValue("description")
          ? row.original.description.slice(0, 70) + "..."
          : "N/A"}
      </div>
    ),
  },
  {
    accessorKey: "image",
    header: "Image",
    cell: ({ row }) => (
      <Avatar>
        <AvatarImage
          src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/${row.original.image}`}
        />
      </Avatar>
    ),
  },
  {
    accessorKey: "courseCount",
    header: "Course Count",
    cell: ({ row }) => <div>{row.original.courseCount}</div>,
  },


  {
    accessorKey: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const { mutate, isPending, isSuccess } = useDeleteMainCourse();
      return (
        <CellAction
          updateForm={<MainCourseForm data={row.original as any} />}
          id={row.original._id}
          deletFn={() => mutate(row.original._id)}
          dltLoading={isPending}
          isSuccess={isSuccess}
        />
      );
    },
  },
];
