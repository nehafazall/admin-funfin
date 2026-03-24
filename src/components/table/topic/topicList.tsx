"use client";
import React from "react";
import { DataTable } from "../../global/data-table";
import { getTopicColumns } from "./column";
import { DataTableSkeleton } from "../../global/table/data-table-skeleton";
import { useTopic } from "@/hooks/useTopic";

interface Props {
  syllabusId: string;
  courseId: string;
}

const TopicList = ({ syllabusId, courseId }: Props) => {
  const { topics, isPending, total } = useTopic(syllabusId);
  const columns = getTopicColumns(syllabusId, courseId);

  if (isPending)
    return <DataTableSkeleton columnCount={5} rowCount={4} filterCount={1} />;

  return <DataTable selectedRows={[]} data={topics} columns={columns} totalRows={total} />;
};

export default TopicList;
