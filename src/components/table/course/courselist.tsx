"use client";
import React from "react";
import { DataTable } from "../../global/data-table";
import { columns } from "./column";
import { DataTableSkeleton } from "../../global/table/data-table-skeleton";
import { useCourse } from "@/hooks/useCourse";

interface Props {}

const CourseList = (props: Props) => {
  const { courses, isPending, total } = useCourse();

  if (isPending) return <DataTableSkeleton columnCount={5} rowCount={8} filterCount={2} />;

  return <DataTable selectedRows={[]} data={courses} columns={columns} totalRows={total} />;
};

export default CourseList;
