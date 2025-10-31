// src/components/ui/date-picker.tsx
"use client";

import * as React from "react";
import { ChevronDownIcon, CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { FieldError } from "react-hook-form";

type BirthdayPickerProps = {
  value?: Date;
  onChange?: (date: Date | undefined) => void;
  error?: FieldError;
};

export function BirthdayPicker({
  value,
  onChange,
  error,
}: BirthdayPickerProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <div className="flex flex-col">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-full justify-between font-normal",
              !value && "text-muted-foreground",
              error && "border-destructive"
            )}
          >
            <div className="flex items-center gap-2">
              <CalendarIcon className="w-4 h-4" />
              {value ? format(value, "PPP") : "Select your date of birth"}
            </div>
            <ChevronDownIcon className="w-4 h-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={value}
            onSelect={(date) => {
              onChange?.(date);
              setOpen(false);
            }}
            captionLayout="dropdown"
            startMonth={new Date(1950, 0)}
            endMonth={new Date(2006, 0)}
            disabled={(date) =>
              date > new Date() || date < new Date("1950-01-01")
            }
            initialFocus
          />
        </PopoverContent>
      </Popover>
      {error?.message && (
        <p className="text-sm text-destructive mt-1">{error.message}</p>
      )}
    </div>
  );
}
