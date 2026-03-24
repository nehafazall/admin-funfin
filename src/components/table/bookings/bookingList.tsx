"use client";
import React from "react";
import { DataTable } from "../../global/data-table/serverSideTable";
import { columns } from "./column";
import { DataTableSkeleton } from "../../global/table/data-table-skeleton";
import { useCourse } from "@/hooks/useCourse";
import { useBookings, useDeleteMultipleBookings } from "@/hooks/useBookings";

interface Props {
  data: any;
  isPending: boolean;
  setIds: (ids: string[]) => void;
  ids: string[];
}

const BookingList = ({ data, isPending,setIds,ids }: Props) => {
  // Showcasing the use of search params cache in nested RSCs
 
  if (isPending)
    return <DataTableSkeleton columnCount={5} rowCount={8} filterCount={2} />;

  if (data) {
    const schemas = (data as any).bookings;
    const pagination = (data as any).pagination;
    const total=pagination?.total;
    
    return (
      <DataTable
        data={schemas}
        columns={columns}
        totalRows={data?.pagination?.total}
        setSelectedRows={(e) => {
          setIds(e.map((row: any) => row?._id));
        }}
        selectedRows={ids}
      
      />
    );
  }
  return null;
};

export default BookingList;
