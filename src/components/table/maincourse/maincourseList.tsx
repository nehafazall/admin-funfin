"use client";
import React from "react";
import { DataTable } from "../../global/data-table";
import { columns } from "./column";
import { DataTableSkeleton } from "../../global/table/data-table-skeleton";
  import { useMainCourse } from "@/hooks/useMaincourse";

interface Props {}

const MainCourseList = (props: Props) => {
  // Showcasing the use of search params cache in nested RSCs



  const { data, isPending } = useMainCourse();

  if (isPending) return <DataTableSkeleton columnCount={5} rowCount={8} filterCount={2} />;

  if (data) {
    const schemas = (data as any).courses;
    return <DataTable  data={schemas} columns={columns} />;
  }
  return null;
};

export default MainCourseList;
