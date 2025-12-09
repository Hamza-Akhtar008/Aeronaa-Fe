"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { CalendarDays } from "lucide-react";
import { format } from "date-fns";

interface ChangeAvailabilityModalProps {
  open: boolean;
  onClose: () => void;
  room: Room | null;
  onSave: (available: boolean, untilDate?: Date) => void;
}

export function ChangeAvailabilityModal({
  open,
  onClose,
  room,
  onSave,
}: ChangeAvailabilityModalProps) {
  const [available, setAvailable] = useState(room?.isActive ?? false);
  const [untilDate, setUntilDate] = useState<Date | undefined>(undefined);

  useEffect(() => {
    setAvailable(room?.isActive ?? false);
  }, [room]);

  const handleSave = () => {
    onSave(available, untilDate);
    onClose();
  };

  const showCalendar = room?.isActive === true;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md rounded-2xl border-0 shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold text-gray-900 flex items-center gap-2">
            <CalendarDays className="w-6 h-6 text-green-600" />
            Change Availability
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            Manage availability for{" "}
            <span className="font-semibold text-gray-900">
              {room?.roomType}
            </span>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Toggle for Availability */}
          <div className="flex items-center justify-between">
            <Label className="text-gray-800 font-medium">Room Available</Label>
            <Switch checked={available} onCheckedChange={setAvailable} />
          </div>

          {/* Show date selection only if room is active */}
          {showCalendar &&!available  && (
            <div className="space-y-2">
              <Label className="text-gray-800 font-medium">
                Make Unavailable Until
              </Label>
              <div className="border rounded-md p-2">
                <Calendar
                  mode="single"
                  selected={untilDate}
                  onSelect={setUntilDate}
                  fromDate={new Date()}
                />
              </div>
              {untilDate && (
                <p className="text-sm text-gray-500">
                  Selected: {format(untilDate, "PPP")}
                </p>
              )}
            </div>
          )}
        </div>

        <DialogFooter className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
