"use client";

import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSidebar } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { useEffect, useCallback } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

interface DataTableProps {
  columns: any;
  data: any;
  totalRows?: number; // Optional - may be unknown
  search?: boolean;
  pageCount?: number;
  hasNextPage?: boolean; // New: Indicate if there's a next page
  selectedRows?: any[];
  setSelectedRows?: (rows: any[]) => void;
}

export function DataTable({
  columns,
  data,
  totalRows,
  search: enableSearch = true,
  pageCount: serverPageCount,
  hasNextPage,
  selectedRows,
  setSelectedRows,

}: DataTableProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isMobile = useIsMobile();

  // Get initial values from URL (using skip/limit)
  const initialSkip = Number(searchParams.get("skip")) || 0;
  const initialLimit = Number(searchParams.get("limit")) || 10;
  const initialSearch = searchParams.get("search") || "";

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = React.useState(initialSearch);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [pagination, setPagination] = React.useState({
    pageIndex: Math.floor(initialSkip / initialLimit), // Calculate page from skip
    pageSize: initialLimit,
  });

  // Debounce search to avoid too many URL updates
  const [searchValue, setSearchValue] = React.useState(initialSearch);
  const [debouncedSearch, setDebouncedSearch] = React.useState(initialSearch);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchValue);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchValue]);

  // Update URL when filters change
  const updateURL = useCallback(
    (updates: { skip?: number; limit?: number; search?: string }) => {
      const params = new URLSearchParams(searchParams.toString());

      // Update skip
      if (updates.skip !== undefined) {
        if (updates.skip === 0) {
          params.delete("skip");
        } else {
          params.set("skip", updates.skip.toString());
        }
      }

      // Update limit
      if (updates.limit !== undefined) {
        if (updates.limit === 10) {
          params.delete("limit");
        } else {
          params.set("limit", updates.limit.toString());
        }
      }

      // Update search
      if (updates.search !== undefined) {
        if (updates.search === "") {
          params.delete("search");
        } else {
          params.set("search", updates.search);
        }
      }



      const queryString = params.toString();
      const newUrl = queryString ? `${pathname}?${queryString}` : pathname;

      router.push(newUrl, { scroll: false });
    },
    [pathname, router, searchParams]
  );

  // Update URL when search changes (debounced)
  useEffect(() => {
    updateURL({
      search: debouncedSearch,
      skip: 0 // Reset to first page (skip=0) when searching
    });
  }, [debouncedSearch]);

  // Update URL when pagination changes
  useEffect(() => {
    const skip = pagination.pageIndex * pagination.pageSize;
    updateURL({
      skip: skip,
      limit: pagination.pageSize,
    });
  }, [pagination.pageIndex, pagination.pageSize]);

  // Sync pagination state with URL params
  useEffect(() => {
    const skipFromUrl = Number(searchParams.get("skip")) || 0;
    const limitFromUrl = Number(searchParams.get("limit")) || 10;

    setPagination({
      pageIndex: Math.floor(skipFromUrl / limitFromUrl),
      pageSize: limitFromUrl,
    });


  }, [searchParams]);

  const table = useReactTable({
    data,
    columns,
    pageCount: serverPageCount ?? (totalRows ? Math.ceil(totalRows / pagination.pageSize) : -1),
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      // globalFilter,
      pagination,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    manualPagination: true, // Important for server-side pagination
    rowCount: totalRows ?? -1, // -1 indicates unknown row count
  });


  React.useEffect(() => {
    if (table.getSelectedRowModel().rows.length > 0 && !!setSelectedRows) {
      console.log(
        "setSelectedRows",
        table.getSelectedRowModel().rows.map((r) => r.original)
      );
      setSelectedRows(table.getSelectedRowModel().rows.map((r) => r.original));
    }
  }, [table.getSelectedRowModel().rows]);

  React.useEffect(() => {
    if (typeof selectedRows !== undefined && selectedRows?.length === 0) {
      table.toggleAllPageRowsSelected(false);
      console.log("selectedRows");
    }
  }, [typeof selectedRows !== undefined, (selectedRows || [])?.length]);

  const { state: sidebarState } = useSidebar();

  return (
    <div className="w-full">
      <div className="flex items-center py-4 gap-2">
        {enableSearch && (
          <Input
            placeholder="Serach Globally"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="md:max-w-sm w-auto h-8 rounded-xl bg-white/5"
          />
        )}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto h-8 rounded-xl">
              {isMobile ? "Cols" : "Columns"} <ChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) => column.toggleVisibility(!!value)}
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className={cn(
        "rounded-md  border  overflow-hidden",
        sidebarState === "expanded" ? "md:w-[calc(100vw-20rem)] w-[90vw]" : "md:w-[calc(100vw-5rem)] w-[90vw]"
      )}>
        <ScrollArea
          className={cn(
            "rounded-md",
            // sidebarState === "expanded" ? "md:w-[calc(100vw-20rem)] w-[90vw]" : "md:w-[calc(100vw-5rem)] w-[90vw]"
          )}
        >
          <Table className={cn("min-w-max ",
            !table.getRowModel().rows?.length && "overflow-auto"
          )}>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-24 text-center">
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          <ScrollBar orientation="horizontal" />

        </ScrollArea>
      </div>

      <div className="flex items-center justify-between space-x-2 py-4">
        <div className="flex items-center gap-2">
          <div className="text-sm text-muted-foreground">
            {totalRows !== undefined ? (
              <>
                Showing {(Math.min((pagination.pageIndex + 1) * pagination.pageSize, totalRows) !== 0) ? pagination.pageIndex * pagination.pageSize + 1 : 0} to{" "}
                {Math.min((pagination.pageIndex + 1) * pagination.pageSize, totalRows)} of{" "}
                {totalRows} rows
              </>
            ) : (
              <>
                Showing {(pagination.pageIndex * pagination.pageSize + data.length !== 0) ? pagination.pageIndex * pagination.pageSize + 1 : 0} to{" "}
                {pagination.pageIndex * pagination.pageSize + data.length}
                {hasNextPage && " (more available)"}
              </>
            )}
          </div>

          <Select
            value={pagination.pageSize.toString()}
            onValueChange={(value) => {
              setPagination({
                pageIndex: 0, // Reset to first page when changing page size
                pageSize: Number(value),
              });
            }}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[10, 20, 30, 40, 50, 100].map((pageSize) => (
                <SelectItem key={pageSize} value={pageSize.toString()}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={
              hasNextPage !== undefined
                ? !hasNextPage // Use hasNextPage if provided
                : !table.getCanNextPage() // Fall back to table state
                || Math.min((pagination.pageIndex + 1) * pagination.pageSize, totalRows) == 0 || pagination.pageIndex * pagination.pageSize + data.length == 0
            }
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}