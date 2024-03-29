"use client";
import { endOfYear, format, startOfYear } from "date-fns";
import { DateRange } from "react-day-picker";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  PopoverContent,
  Popover,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { fr } from "date-fns/locale";
import { useState } from "react";

interface DateRangePickerProps extends React.HTMLAttributes<HTMLDivElement> {
  setDateRange: (range: { from: Date; to: Date }) => void;
  onDateChange?: (range: { from: Date; to: Date }) => void;
}

export function DateRangePicker({
  className,
  setDateRange,
  onDateChange,
}: DateRangePickerProps) {
  const currentYear = new Date().getFullYear();
  const [date, setDate] = useState<DateRange | undefined>({
    from: startOfYear(new Date(currentYear, 0, 1)),
    to: endOfYear(new Date(currentYear, 11, 31)),
  });

  const handleSelect = (range: DateRange | undefined) => {
    setDate(range);
    if (range) {
      setDateRange({ from: range.from!, to: range.to! });
      onDateChange?.({ from: range.from!, to: range.to! });
    }
  };

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-[280px] flex gap-x-3 justify-start border text-left text-xs bg-background lowercase",
              !date && "text-secondary-foreground"
            )}
          >
            <CalendarIcon className="h-4 w-4" color="rgb(var(--primary))" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "LLL dd, y", { locale: fr })} -{" "}
                  {format(date.to, "LLL dd, y", { locale: fr })}
                </>
              ) : (
                format(date.from, "LLL dd, y", { locale: fr })
              )
            ) : (
              <span>Chosir une date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="end">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={handleSelect}
            numberOfMonths={2}
            locale={fr}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
