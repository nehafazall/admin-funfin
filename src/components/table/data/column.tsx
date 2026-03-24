"use client";

import * as React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "@/components/global/cell-actions";
// import BrandEditForm from "@/components/forms/brandEditForm";
// import { useDltBrand } from "@/hooks/useBrand";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import SchemaForm from "@/components/forms/courseForm";
import { ImEmbed2 } from "react-icons/im";
// import { useDeleteBranch } from "@/hooks/useBranch";
export type Cloumn = {
  _id: string;
  data?: Record<string, any>;
};

function DataColumn(data: Cloumn[]) {
  const uniqueKeys = Array.from(
    
    new Set(
      data.flatMap((item) => {
        if (item?.data) {
          return Object.keys(item.data);
        }
        return [];
      })
    )
  );
  const columns: ColumnDef<Cloumn>[] = [
    {
      accessorKey: "rowNumber",
      header: "#",
      cell: ({ row }) => <div>{row.index + 1}</div>,
    },
    ...uniqueKeys.map((key) => ({
      accessorKey: key,
      header: key.charAt(0).toUpperCase() + key.slice(1), // Capitalize the header
      cell: ({ row }: { row: { original: Cloumn } }) => (
        <div>{row.original.data[key]}</div>
      ),
    })),
  ];
  return columns;
}

export default DataColumn;
