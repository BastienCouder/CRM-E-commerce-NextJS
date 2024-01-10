"use client";
import { Separator } from "@/components/ui/separator";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTrigger,
} from "@/components/ui/sheet";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import PriceRangeFilter from "@/components/shop/price-range-filter";
import AccordionFilter from "@/components/shop/accordion-filter";
import { Color } from "@/schemas/db-schema";
import { ChevronDown } from "lucide-react";

interface FilterProps {
  colors: Color[];
  selectedSort: string;
  onSelectColor: (category: Color | null) => void;
  selectedColor: Color | null;
  priceRange: number;
  PriceRangeChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onSortAlphabetically: () => void;
  onSortReverseAlphabetically: () => void;
}

export default function Filter({
  colors,
  onSelectColor,
  selectedColor,
  selectedSort,
  onSortAlphabetically,
  onSortReverseAlphabetically,
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
      <div className="block">
        <Sheet>
          <SheetTrigger>
            <div className="text-sm md:text-base flex items-center rounded-lg uppercase bg-primary h-full px-3 py-2">
              filtres et tries
              <ChevronDown size={15} className={`ml-2 `} />
            </div>
          </SheetTrigger>
          <SheetContent side="left" className="w-full md:w-[400px]">
            <SheetHeader>
              <SheetDescription>
                <div className="w-full flex justify-center h-[4rem] items-center">
                  <h2 className="uppercase text-lg">filtres et tries</h2>
                </div>
                <Separator className="h-[2px]" />

                <div className="mt-8 space-y-8 flex flex-col w-full relative">
                  <div className="w-[10rem]">
                    <AccordionFilter<Color>
                      title="Couleurs"
                      items={colors}
                      selectedItem={selectedColor}
                      onItemClick={handleColorClick}
                      onReset={handleResetColor}
                    />
                  </div>
                  <Accordion
                    className="-mt-4 w-[10rem]"
                    type="single"
                    collapsible
                  >
                    <AccordionItem value="item-1" className="relative">
                      <AccordionTrigger className="text-sm md:text-base font-Noto">
                        Trier
                      </AccordionTrigger>
                      <AccordionContent>
                        <p
                          className={`text-sm cursor-pointer ${
                            selectedSort === "A-Z"
                              ? "text-secondary"
                              : "text-white"
                          }`}
                          onClick={onSortAlphabetically}
                        >
                          Ordre A-Z
                        </p>
                      </AccordionContent>
                      <AccordionContent>
                        <p
                          className={`text-sm cursor-pointer ${
                            selectedSort === "Z-A"
                              ? "text-secondary"
                              : "text-white"
                          }`}
                          onClick={onSortReverseAlphabetically}
                        >
                          Ordre Z-A
                        </p>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
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
