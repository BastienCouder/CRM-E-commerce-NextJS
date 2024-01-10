"use client";
import { Separator } from "@/components/ui/separator";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTrigger,
} from "@/components/ui/sheet";
import PriceRangeFilter from "@/components/shop/price-range-filter";
import AccordionFilter from "@/components/shop/accordion-filter";
import { Color } from "@/schemas/db-schema";
import { ArrowDown } from "lucide-react";

interface FilterProps {
  colors: Color[];
  onSelectColor: (category: Color | null) => void;
  selectedColor: Color | null;
  priceRange: number;
  PriceRangeChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function Filter({
  colors,
  onSelectColor,
  selectedColor,

  PriceRangeChange,
  priceRange,
}: FilterProps) {
  const handleColorClick = (color: Color) => {
    onSelectColor(color);
  };

  const handleResetColor = () => {
    onSelectColor(null);
  };

  return (
    <>
      <div className="hidden xl:block w-full p-4 pb-10">
        <div className="w-full flex justify-center h-[4rem] items-center">
          <h2 className="uppercase text-xl font-Noto">Filtres</h2>
        </div>
        <Separator className="h-[2px]" />

        <div className="mt-8 space-y-8 flex flex-col w-full relative">
          <AccordionFilter<Color>
            title="Couleurs"
            items={colors}
            selectedItem={selectedColor}
            onItemClick={handleColorClick}
            onReset={handleResetColor}
          />
          <PriceRangeFilter
            priceRange={priceRange}
            onPriceRangeChange={PriceRangeChange}
          />
        </div>
      </div>
      <div className="block xl:hidden">
        <Sheet>
          <SheetTrigger>
            <div className="text-sm md:text-base flex items-center uppercase bg-primary h-full px-3 py-2 font-Noto">
              Filtres
              <ArrowDown size={15} className={`ml-2 `} />
            </div>
          </SheetTrigger>
          <SheetContent side="left" className="w-full md:w-[400px]">
            <SheetHeader>
              <SheetDescription>
                <div className="w-full flex justify-center h-[4rem] items-center">
                  <h2 className="uppercase text-lg">Filtres</h2>
                </div>
                <Separator className="h-[2px]" />

                <div className="mt-8 space-y-8 flex flex-col w-full relative">
                  <AccordionFilter<Color>
                    title="Couleurs"
                    items={colors}
                    selectedItem={selectedColor}
                    onItemClick={handleColorClick}
                    onReset={handleResetColor}
                  />
                  <PriceRangeFilter
                    priceRange={priceRange}
                    onPriceRangeChange={PriceRangeChange}
                  />
                </div>
              </SheetDescription>
            </SheetHeader>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
