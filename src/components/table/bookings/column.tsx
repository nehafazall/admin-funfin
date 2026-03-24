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
import { IBooking } from "@/types/IBooking";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { SiGoogleclassroom } from "react-icons/si";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
// import { useDeleteBranch } from "@/hooks/useBranch";
export type Cloumn = IBooking;

export const columns: ColumnDef<Cloumn>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
    size: 30,
  },
  // {
  //   accessorKey: "rowNumber",
  //   header: "#",
  //   cell: ({ row }) => <div>{row.index + 1}</div>,
  // },
  // check columns for selection
  {
    accessorKey: "courseId.name",
    header: "Course",
    cell: ({ row }) => <div>{row.original.courseId.name}</div>,
  },
  {
    accessorKey: "courseId?.mainCourseId?.name",
    header: "Main Course",
    cell: ({ row }) => <Badge>{row.original?.courseId?.mainCourseId?.name || "N/A"}</Badge>,
  },

  {
    accessorKey: "studentId.name",
    header: "Student",
    cell: ({ row }) => <div>{row.original.studentId.name}</div>,
  },
  {
    accessorKey: "studentId.email",
    header: "Email",
    cell: ({ row }) => <div>{row.original.studentId.email}</div>,
  },

  {
    accessorKey: "section.time",
    header: "Time",
    cell: ({ row }) => (
      <>
        <Badge variant="outline">{row.original.section.time}</Badge>
      </>
    ),
  },
  {
    accessorKey: "section.language",
    header: "Language",
    cell: ({ row }) => (
      <>
        <Badge variant="default">{row.original.section.language}</Badge>
      </>
    ),
  },
  {
    accessorKey: "bookingDate.toLocaleDateString()",
    header: "Booking Date",
    cell: ({ row }) => (
      <Badge variant="outline">
        {new Date(row.original.bookingDate).toLocaleDateString()}
      </Badge>
    ),
  },
  {
    accessorKey: "createdAt.toLocaleDateString()",
    header: "Booking Created",
    cell: ({ row }) => (
      <Badge variant="outline">
        {new Date(row.original.createdAt).toLocaleDateString()}
      </Badge>
    ),
  },
  {
    accessorKey: "updatedAt.toLocaleDateString()",
    header: "Booking Updated",
    cell: ({ row }) => (
      <Badge variant="outline">
        {new Date(row.original.updatedAt).toLocaleDateString()}
      </Badge>
    ),
  },
];
