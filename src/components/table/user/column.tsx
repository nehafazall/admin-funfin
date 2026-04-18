"use client";

import * as React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "@/components/global/cell-actions";
import { Badge } from "@/components/ui/badge";
import { useDeleteUser } from "@/hooks/useAdmin";
import { IUser } from "@/types/IUser";
import UserForm from "@/components/forms/userForm";

export type Column = IUser;

const UserActionsCell = ({ user }: { user: Column }) => {
  const { mutate, isPending, isSuccess } = useDeleteUser();

  return (
    <CellAction
      updateForm={<UserForm data={user} />}
      id={user._id}
      deletFn={() => mutate(user._id)}
      dltLoading={isPending}
      isSuccess={isSuccess}
    />
  );
};

export const columns: ColumnDef<Column>[] = [
  {
    accessorKey: "rowNumber",
    header: "#",
    cell: ({ row }) => <div>{row.index + 1}</div>,
  },
  {
    accessorKey: "fullName",
    header: "Name",
    cell: ({ row }) => <div className="font-medium">{row.getValue("fullName")}</div>,
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => (
      <div className="text-muted-foreground">{row.getValue("email") || "N/A"}</div>
    ),
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => (
      <Badge
        variant={
          row.original?.role === "superadmin"
            ? "default"
            : row.original?.role === "admin"
            ? "secondary"
            : row.original?.role === "mentor"
            ? "outline"
            : "outline"
        }
      >
        {row.original?.role}
      </Badge>
    ),
  },
  {
    accessorKey: "isActive",
    header: "Status",
    cell: ({ row }) => (
      <Badge variant={row.original?.isActive ? "default" : "destructive"}>
        {row.original?.isActive ? "Active" : "Inactive"}
      </Badge>
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
    cell: ({ row }) => <UserActionsCell user={row.original} />,
  },
];
