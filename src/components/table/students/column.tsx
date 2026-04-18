"use client";

import * as React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "@/components/global/cell-actions";
// import BrandEditForm from "@/components/forms/brandEditForm";
// import { useDltBrand } from "@/hooks/useBrand";
import { Button, buttonVariants } from "@/components/ui/button";
import { ClockIcon, Copy, PlusIcon, UserIcon } from "lucide-react";
import SchemaForm from "@/components/forms/courseForm";
import { ImEmbed2 } from "react-icons/im";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Dialog } from "@/components/ui/dialog";
import SchemaInfo from "@/components/global/orderInfo";
import { cn, convertNumberToTime } from "@/lib/utils";
import { useDeleteCourse } from "@/hooks/useCourse";

import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { SiGoogleclassroom } from "react-icons/si";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { IStudent } from "@/types/IStudent";
import StudentForm from "@/components/forms/stundentForm";
import { useDeleteStudent } from "@/hooks/useStudents";
// import { useDeleteBranch } from "@/hooks/useBranch";
export type Cloumn = IStudent;

const StudentActionsCell = ({ student }: { student: Cloumn }) => {
  const { mutate, isPending, isSuccess } = useDeleteStudent();

  return (
    <CellAction
      updateForm={<StudentForm data={student} />}
      id={student._id}
      deletFn={() => mutate(student._id)}
      dltLoading={isPending}
      isSuccess={isSuccess}
    />
  );
};

export const columns: ColumnDef<Cloumn>[] = [
  {
    accessorKey: "rowNumber",
    header: "#",
    cell: ({ row }) => <div>{row.index + 1}</div>,
  },
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => <div>{row.getValue("name")}</div>,
  },
  {
    accessorKey: "isActive",
    header: "Active",
    cell: ({ row }) => (
      <Badge variant={row.getValue("isActive") ? "secondary" : "destructive"}>
        {row.getValue("isActive") ? "Active" : "Inactive"}
      </Badge>
    ),
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => (
      <div>{row.getValue("email") ? row.getValue("email") : "N/A"}</div>
    ),
  },
  {
    accessorKey: "code",
    header: "Code",
    cell: ({ row }) => (
      <Badge variant="default">
        {row.getValue("code") ? row.getValue("code") : "N/A"}
      </Badge>
    ),
  },
  {
    accessorKey: "attendance",
    header: "Attendance",
    cell: ({ row }) => (
      <>
        <Dialog>
          <DialogTrigger>
            <div
              className={cn(buttonVariants({ variant: "outline" }), "text-xs")}
            >
              <SiGoogleclassroom className="w-4 h-4" />
            </div>
          </DialogTrigger>
          <DialogContent className="max-w-[550px]">
            <DialogHeader>
              <DialogTitle>Attendance</DialogTitle>
            </DialogHeader>
            <div className="rounded-md flex flex-col gap-2 border bg-muted p-2">
              <div className="flex justify-between items-center">
                <h1 className="text-sm font-medium">#</h1>
                <h1 className="text-sm font-medium">Course</h1>
                <h1 className="text-sm font-medium">Section</h1>
                <h1 className="text-sm font-medium">Date</h1>
                {/* <h1 className="text-sm font-medium">Status</h1> */}
              </div>
              {row.original?.attendance?.map((attendance: any, index: number) => (
                <div key={`${attendance?._id ?? "attendance"}-${index}`} className="flex justify-between items-center">
                  <p className="text-xs font-medium">{index + 1}</p>
                  <p className="text-xs font-medium">
                    {attendance?.courseId?.name}
                  </p>
                  <p className="text-xs font-medium">
                    {attendance?.section?.language}-{attendance?.section?.time}
                  </p>
                  <p className="text-xs font-medium">
                    {new Date(attendance?.date).toLocaleDateString("en-US", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </div>
              ))}
            </div>
          </DialogContent>
        </Dialog>
      </>
    ),
  },
  {
    accessorKey: "limit",
    header: "Limit",
    cell: ({ row }) => (
      <Badge variant="outline">
        {row.getValue("limit") ? row.getValue("limit") : "N/A"}
      </Badge>
    ),
  },
  {
    accessorKey: "limitAvailable",
    header: "Limit Available",
    cell: ({ row }) => (
      <div className="text-center">
        {row.getValue("limitAvailable")
          ? row.getValue("limitAvailable")
          : "N/A"}
      </div>
    ),
  },
  {
    accessorKey: "buyedCourse",
    header: "Buyed Course",
    cell: ({ row }) => (
      <div className="text-center">
        {row.original?.buyedCourse?.name || "N/A"}
      </div>
    ),
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ row }) => (
      <div className="text-center">
        {row.original?.createdAt
          ? new Date(row.original?.createdAt).toLocaleDateString("en-US", {
              day: "numeric",
              month: "short",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })
          : "N/A"}
      </div>
    ),
  },
  {
    accessorKey: "adminId",
    header: "Admin",
    cell: ({ row }) => (
      <div className="text-center">{row.original?.adminId?.fullName || "N/A"}</div>
    ),
  },
  {
    accessorKey: "actions",
    header: "Actions",
    cell: ({ row }) => <StudentActionsCell student={row.original} />,
  },
];
