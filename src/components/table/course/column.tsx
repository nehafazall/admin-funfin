"use client";

import * as React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "@/components/global/cell-actions";
import CourseForm from "@/components/forms/courseForm";
import { useDeleteCourse } from "@/hooks/useCourse";
import { ICourse } from "@/types/ICourse";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import CourseContent from "./courseContent";
import Link from "next/link";

export type Column = ICourse;

export const columns: ColumnDef<Column>[] = [
  {
    accessorKey: "rowNumber",
    header: "#",
    cell: ({ row }) => <div>{row.index + 1}</div>,
  },
  {
    accessorKey: "photo",
    header: "Photo",
    cell: ({ row }) => (
      <Avatar>
        <AvatarImage src={row.original.photo} alt={row.original.title} />
        <AvatarFallback>{row.original.title?.charAt(0)}</AvatarFallback>
      </Avatar>
    ),
  },
  {
    accessorKey: "title",
    header: "Title",
    cell: ({ row }) => (
      <Link
        href={`/admin/courses/${row.original.id}`}
        className="font-medium hover:underline hover:text-primary transition-colors"
      >
        {row.getValue("title")}
      </Link>
    ),
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => (
      <div className="max-w-[200px] truncate text-muted-foreground">
        {row.original.description || "N/A"}
      </div>
    ),
  },
  {
    accessorKey: "duration",
    header: "Duration",
    cell: ({ row }) => <Badge variant="outline">{row.original.duration}</Badge>,
  },
  {
    accessorKey: "totalModules",
    header: "Modules",
    cell: ({ row }) => <div>{row.original.totalModules ?? "—"}</div>,
  },
  {
    accessorKey: "rating",
    header: "Rating",
    cell: ({ row }) => (
      <div>{row.original.rating != null ? `⭐ ${row.original.rating}` : "—"}</div>
    ),
  },
  {
    accessorKey: "isPublished",
    header: "Status",
    cell: ({ row }) => (
      <Badge variant={row.original.isPublished ? "default" : "secondary"}>
        {row.original.isPublished ? "Published" : "Draft"}
      </Badge>
    ),
  },
  {
    accessorKey: "createdAt",
    header: "Created",
    cell: ({ row }) => (
      <div className="text-xs text-muted-foreground">
        {new Date(row.original.createdAt).toLocaleDateString()}
      </div>
    ),
  },
  {
    accessorKey: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const { mutate, isPending, isSuccess } = useDeleteCourse();
      return (
        <CellAction
          updateForm={<CourseForm data={{ ...row.original, _id: row.original.id } as any} />}
          info={<CourseContent course={row.original} />}
          id={row.original.id}
          deletFn={() => mutate(row.original.id)}
          dltLoading={isPending}
          isSuccess={isSuccess}
        />
      );
    },
  },
];
