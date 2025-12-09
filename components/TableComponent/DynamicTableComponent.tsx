"use client";

import React, { useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  Edit2,
  MoreVertical,
  Plus,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Type for a single column definition
export type TableColumn<T> = {
  key: keyof T | string;
  label: string;
  render?: (row: T) => React.ReactNode;
};

// Props for the table component
export type TableComponentProps<T> = {
  title?: string;
  data: T[];
  columns: TableColumn<T>[];
  buttonTitle?: string;
  onButtonClick?: () => void;
  rowsPerPageOptions?: number[];
};

// Generic reusable table component
export function TableComponent<T extends Record<string, any>>({
  title = "Add New",
  data,
  columns,
  buttonTitle,
  onButtonClick,
  rowsPerPageOptions = [5, 10, 25, 50],
}: TableComponentProps<T>) {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [rowsPerPage, setRowsPerPage] = useState<number>(rowsPerPageOptions[0]);

  // Sorting logic
  const handleSort = (key: string) => {
    if (sortField === key) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(key);
      setSortDirection("asc");
    }
  };

  // Filter and sort data
  const filteredData = [...data] // make a copy to avoid mutating the original
  .filter((item) =>
    Object.values(item)
      .join(" ")
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  )
 .sort((a, b) => {
  if (!sortField) return 0;

  const aVal = (a as any)[sortField];
  const bVal = (b as any)[sortField];

  if (aVal == null && bVal != null) return sortDirection === "asc" ? 1 : -1;
  if (aVal != null && bVal == null) return sortDirection === "asc" ? -1 : 1;
  if (aVal == null && bVal == null) return 0;

  const aNum = parseFloat(aVal);
  const bNum = parseFloat(bVal);

  const bothNumbers = !isNaN(aNum) && !isNaN(bNum);
  if (bothNumbers) {
    return sortDirection === "asc" ? aNum - bNum : bNum - aNum;
  }

  const aStr = String(aVal).trim().toLowerCase();
  const bStr = String(bVal).trim().toLowerCase();

  return sortDirection === "asc"
    ? aStr.localeCompare(bStr)
    : bStr.localeCompare(aStr);
});



  const paginatedData = filteredData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const totalPages = Math.ceil(filteredData.length / rowsPerPage);

  return (
  <div className="space-y-6">
  {/* Header */}
  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
    <div>
      <h2 className="text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#023e8a]  to-[#00b4d8]">
        {title}
      </h2>
    </div>
    {buttonTitle && (
      <Button
        onClick={onButtonClick}
        className="w-full sm:w-auto bg-gradient-to-r from-[#023e8a] to-[#00b4d8] text-white hover:brightness-110 transition"
      >
        <Plus className="mr-2 h-4 w-4" />
        {buttonTitle}
      </Button>
    )}
  </div>

  {/* Filters */}
  <div className="flex items-center gap-4">
    <div className="relative w-full sm:max-w-xs">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
      <Input
        placeholder="Search..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="h-10 pl-10 pr-3 border border-gray-300 shadow-sm focus:ring-2 focus:ring-[#00b4d8]"
      />
    </div>
  </div>

  {/* Table */}
  <div className="rounded-xl border border-gray-200 shadow-md overflow-hidden">
    <div className="max-h-[450px] overflow-y-auto">
      <table className="min-w-full bg-white dark:bg-gray-800">
        <thead className="bg-gradient-to-r from-[#023e8a]  to-[#00b4d8] text-white">
          <tr>
            {columns.map((col) => (
              <th
                key={col.key as string}
                onClick={() => handleSort(col.key as string)}
                className="px-4 py-3 text-left text-sm font-semibold cursor-pointer select-none"
              >
                <div className="flex items-center">
                  {col.label}
                  {sortField === col.key &&
                    (sortDirection === "asc" ? (
                      <ChevronUp className="ml-1 h-4 w-4" />
                    ) : (
                      <ChevronDown className="ml-1 h-4 w-4" />
                    ))}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
          {paginatedData.length > 0 ? (
            paginatedData.map((row, idx) => (
              <tr
                key={idx}
                className="hover:bg-gray-50 dark:hover:bg-gray-700 transition"
              >
                {columns.map((col) => (
                  <td key={col.key as string} className="px-4 py-4 text-sm text-gray-700 dark:text-gray-200">
                    {col.render ? col.render(row) : (row as any)[col.key]}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={columns.length}
                className="px-4 py-6 text-center text-gray-500"
              >
                No data available
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  </div>

  {/* Pagination */}
  <div className="mt-4 flex items-center justify-between">
    <div className="flex items-center space-x-4 text-sm text-gray-600">
      <span>Rows per page:</span>
      <Select
        value={rowsPerPage.toString()}
        onValueChange={(val) => {
          setRowsPerPage(parseInt(val));
          setCurrentPage(1);
        }}
      >
        <SelectTrigger className="h-8 w-20 border border-gray-300">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {rowsPerPageOptions.map((option) => (
            <SelectItem key={option} value={option.toString()}>
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <span>
        {filteredData.length === 0
          ? "0"
          : `${(currentPage - 1) * rowsPerPage + 1} - ${Math.min(
              currentPage * rowsPerPage,
              filteredData.length
            )}`}{" "}
        of {filteredData.length}
      </span>
    </div>

    <div className="flex space-x-2">
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8"
        disabled={currentPage === 1}
        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8"
        disabled={currentPage === totalPages}
        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  </div>
</div>
  );
}
