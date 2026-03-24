"use client";
import React from "react";
import { DataTable } from "../../global/data-table";
import { columns } from "./column";
import { DataTableSkeleton } from "../../global/table/data-table-skeleton";
import { useUsers } from "@/hooks/useAdmin";

interface Props {}

const UserList = (props: Props) => {
  const { users, isPending, total } = useUsers();

  if (isPending) return <DataTableSkeleton columnCount={5} rowCount={8} filterCount={2} />;

  return <DataTable data={users} columns={columns} totalRows={total} />;
};

export default UserList;
