"use client";
import React from "react";
import { DataTable } from "../../global/data-table";
import { columns } from "./column";
import { DataTableSkeleton } from "../../global/table/data-table-skeleton";
  import { useCourse } from "@/hooks/useCourse";
import { useStudents } from "@/hooks/useStudents";

interface Props {}

const StudentList = (props: Props) => {
  // Showcasing the use of search params cache in nested RSCs



  const { data, isPending } = useStudents();

  if (isPending) return <DataTableSkeleton columnCount={5} rowCount={8} filterCount={2} />;

  if (data) {
    const schemas = (data as any).students;
    return <DataTable  data={schemas} columns={columns} />;
  }
  return null;
};

export default StudentList;
