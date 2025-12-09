"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";

interface MonthSummary {
  month: string;
  totalamount: number;
  totalbookings: number;
}

interface MonthSummaryModalProps {
  open: boolean;
  onClose: () => void;
  monthSummaryData: MonthSummary[];
}

export function MonthSummaryModal({
  open,
  onClose,
  monthSummaryData,
}: MonthSummaryModalProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const totalPages = Math.ceil((monthSummaryData?.length || 0) / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = monthSummaryData?.slice(startIndex, startIndex + itemsPerPage) || [];

  // Helper to display "August 2025" from "2025-08"
  const formatMonth = (month: string) => {
    const [year, monthNumber] = month.split("-");
    const date = new Date(parseInt(year), parseInt(monthNumber) - 1);
    return date.toLocaleString("default", { month: "long", year: "numeric" });
  };

  // Calculate 1% commission
  const calculateCommission = (amount: number) => (amount * 0.01).toFixed(2);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl rounded-3xl border-0 shadow-2xl overflow-hidden">
        <DialogHeader className="pb-4 border-b border-gray-100">
          <DialogTitle className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Calendar className="w-6 h-6 text-green-600" />
            Month-wise Summary
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            Overview of total bookings, revenue, and commission per month
          </DialogDescription>
        </DialogHeader>

        {/* Table Section */}
        <div className="overflow-x-auto mt-4">
          <Table>
            <TableHeader>
              <TableRow className="border-gray-100">
                <TableHead className="font-semibold text-gray-700">Month</TableHead>
                <TableHead className="font-semibold text-gray-700 text-center">Total Bookings</TableHead>
                <TableHead className="font-semibold text-gray-700 text-center">Total Amount</TableHead>
                <TableHead className="font-semibold text-gray-700 text-center">Commission (1%)</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {currentItems.length > 0 ? (
                currentItems.map((item, index) => (
                  <TableRow
                    key={index}
                    className="border-gray-100 hover:bg-gray-50 transition"
                  >
                    <TableCell className="font-medium text-gray-900">
                      {formatMonth(item.month)}
                    </TableCell>
                    <TableCell className="text-center text-gray-800">
                      {item.totalbookings}
                    </TableCell>
                    <TableCell className="text-center font-semibold text-green-700">
                      ${item.totalamount.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-center font-semibold text-blue-600">
                      ${calculateCommission(item.totalamount)}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-gray-500 py-6">
                    No data found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination Controls */}
        {monthSummaryData?.length > itemsPerPage && (
          <div className="flex justify-center items-center gap-3 mt-5">
            <Button
              variant="outline"
              size="sm"
              className="rounded-xl border-gray-200"
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <span className="text-gray-600 font-medium">
              Page {currentPage} of {totalPages}
            </span>

            <Button
              variant="outline"
              size="sm"
              className="rounded-xl border-gray-200"
              onClick={() =>
                setCurrentPage((prev) => Math.min(totalPages, prev + 1))
              }
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
