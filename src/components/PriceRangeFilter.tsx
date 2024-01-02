import React from "react";
import formatPrice from "@/lib/format";

interface PriceRangeFilterProps {
  priceRange: number;
  onPriceRangeChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function PriceRangeFilter({
  priceRange,
  onPriceRangeChange,
}: PriceRangeFilterProps) {
  return (
    <div className="space-y-3">
      <div className="space-x-2 flex items-center">
        <p> Prix : </p>
        <p className="text-sm mt-[1px]">{formatPrice(priceRange, "EUR")}</p>
      </div>
      <div className="flex items-center space-x-4">
        <p className="text-xs">0 €</p>
        <input
          type="range"
          min="1"
          max="50000"
          value={priceRange}
          onChange={onPriceRangeChange}
          className="appearance-none"
        />
        <p className="text-xs">500 €</p>
      </div>
    </div>
  );
}
