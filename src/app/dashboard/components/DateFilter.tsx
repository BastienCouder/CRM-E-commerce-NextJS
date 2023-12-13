"use client";
import { Button } from "@/components/ui/button";

interface DateFilterProps {
  onFilterChange: (startDate: Date) => void;
  siteCreationDate: Date;
  type: string;
}

const generateFilterButton = (
  text: string,
  monthsBack: number,
  onClick: (monthsBack: number) => void,
  customClasses: string = ""
) => (
  <Button
    variant="outline"
    className={`p-1 text-xs ${customClasses}`}
    size="sm"
    onClick={() => onClick(monthsBack)}
  >
    {text}
  </Button>
);

export default function DateFilter({
  onFilterChange,
  siteCreationDate,
  type,
}: DateFilterProps) {
  const applyFilter = (monthsBack: number): void => {
    const endDate = new Date();
    let startDate = new Date(
      endDate.getFullYear(),
      endDate.getMonth() - monthsBack,
      endDate.getDate()
    );
    onFilterChange(startDate);
  };

  const applyFromBeginning = () => {
    onFilterChange(siteCreationDate);
  };

  return (
    <>
      {type === "orders" && (
        <div className="flex gap-x-2">
          <div className="flex flex-col gap-y-2">
            {generateFilterButton("1 Mois", 1, applyFilter)}
            {generateFilterButton("3 Mois", 3, applyFilter)}
          </div>
          <div className="flex flex-col gap-y-2">
            {generateFilterButton("6 Mois", 6, applyFilter)}
            {generateFilterButton("12 Mois", 12, applyFilter)}
          </div>
          {generateFilterButton(
            "Depuis le début",
            0,
            applyFromBeginning,
            "w-44"
          )}
        </div>
      )}
      {type === "analytics" && (
        <div className="flex gap-x-2">
          {generateFilterButton("1 Mois", 1, applyFilter)}
          {generateFilterButton("3 Mois", 3, applyFilter)}

          {generateFilterButton("6 Mois", 6, applyFilter)}
          {generateFilterButton("12 Mois", 12, applyFilter)}

          {generateFilterButton(
            "Depuis le début",
            0,
            applyFromBeginning,
            "w-44"
          )}
        </div>
      )}
    </>
  );
}
