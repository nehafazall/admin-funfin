"use client";

import * as React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "@/components/global/cell-actions";
import { ISyllabus } from "@/types/ISyllabus";
import { useDeleteSyllabus } from "@/hooks/useSyllabus";
import SyllabusForm from "@/components/forms/syllabusForm";
import { Badge } from "@/components/ui/badge";

export type Column = ISyllabus;

export const getSyllabusColumns = (courseId: string): ColumnDef<Column>[] => [
  {
    accessorKey: "rowNumber",
    header: "#",
    cell: ({ row }) => <div>{row.index + 1}</div>,
  },
  {
    accessorKey: "moduleLabel",
    header: "Module",
    cell: ({ row }) => (
      <Badge variant="outline">{row.original.moduleLabel || "—"}</Badge>
    ),
  },
  {
    accessorKey: "title",
    header: "Title",
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("title")}</div>
    ),
  },
  {
    accessorKey: "topics",
    header: "Topics",
    cell: ({ row }) => (
      <div className="text-muted-foreground">
        {row.original.topics?.length ?? 0} topic(s)
      </div>
    ),
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ row }) => (
      <div className="text-xs text-muted-foreground">
        {row.original?.createdAt
          ? new Date(row.original.createdAt).toLocaleDateString("en-US", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })
          : "N/A"}
      </div>
    ),
  },
  {
    accessorKey: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const { mutate, isPending, isSuccess } = useDeleteSyllabus(courseId);
      return (
        <CellAction
          updateForm={<SyllabusForm courseId={courseId} data={row.original} />}
          id={row.original._id}
          deletFn={() => mutate(row.original._id)}
          dltLoading={isPending}
          isSuccess={isSuccess}
        />
      );
    },
  },
];
