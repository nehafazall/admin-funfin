"use client";
import React from "react";
import { DataTable } from "../../global/data-table";
import { getSyllabusColumns } from "./column";
import { DataTableSkeleton } from "../../global/table/data-table-skeleton";
import { useSyllabus } from "@/hooks/useSyllabus";

interface Props {
  courseId: string;
}

const SyllabusList = ({ courseId }: Props) => {
  const { syllabuses, isPending, total } = useSyllabus(courseId);
  const columns = getSyllabusColumns(courseId);

  if (isPending)
    return <DataTableSkeleton columnCount={5} rowCount={4} filterCount={1} />;

  return <DataTable selectedRows={[]} data={syllabuses} columns={columns} totalRows={total} />;
};

export default SyllabusList;
