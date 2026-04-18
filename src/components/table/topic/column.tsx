"use client";

import * as React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "@/components/global/cell-actions";
import { ITopic } from "@/types/ITopic";
import { useDeleteTopic } from "@/hooks/useTopic";
import TopicForm from "@/components/forms/topicForm";

export type Column = ITopic;

const TopicActionsCell = ({
  syllabusId,
  courseId,
  topic,
}: {
  syllabusId: string;
  courseId: string;
  topic: Column;
}) => {
  const { mutate, isPending, isSuccess } = useDeleteTopic(syllabusId);

  return (
    <CellAction
      updateForm={<TopicForm syllabusId={syllabusId} courseId={courseId} data={topic} />}
      id={topic.id || topic._id}
      deletFn={() => mutate(topic.id || topic._id)}
      dltLoading={isPending}
      isSuccess={isSuccess}
    />
  );
};

export const getTopicColumns = (syllabusId: string, courseId: string): ColumnDef<Column>[] => [
  {
    accessorKey: "rowNumber",
    header: "#",
    cell: ({ row }) => <div>{row.index + 1}</div>,
  },
  {
    accessorKey: "title",
    header: "Title",
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("title")}</div>
    ),
  },
  {
    accessorKey: "videoUrl",
    header: "Video URL",
    cell: ({ row }) => (
      <div className="max-w-[200px] truncate text-muted-foreground">
        {row.original.videoUrl ? (
          <a
            href={row.original.videoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="underline text-primary"
          >
            {row.original.videoUrl}
          </a>
        ) : (
          "N/A"
        )}
      </div>
    ),
  },
  {
    accessorKey: "overview",
    header: "Overview",
    cell: ({ row }) => (
      <div className="max-w-[200px] truncate text-muted-foreground">
        {row.original.overview || "—"}
      </div>
    ),
  },
  {
    accessorKey: "order",
    header: "Order",
    cell: ({ row }) => (
      <div className="text-muted-foreground">{row.original.order ?? "—"}</div>
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
    cell: ({ row }) => (
      <TopicActionsCell syllabusId={syllabusId} courseId={courseId} topic={row.original} />
    ),
  },
];
