"use client";
import { Separator } from "@/components/ui/separator";
import { Category } from "@prisma/client";
import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useState } from "react";
import { BsCaretDownFill } from "react-icons/bs";
import { RxCross2 } from "react-icons/rx";
import styles from "@/styles/Utils.module.css";
import formatPrice from "@/lib/format";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTrigger,
} from "@/components/ui/sheet";

interface FilterProps {
  categories: Category[];
  colors: Color[];
  onSelectCategory: (category: Category | null) => void;
  onSelectCOlor: (category: Color | null) => void;
  selectedCategory: Category | null;
  selectedCOlor: Color | null;
  SortAlphabetically: () => void;
  SortReverseAlphabetically: () => void;
  priceRange: number;
  PriceRangeChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function Filter({
  categories,
  onSelectCategory,
  selectedCategory,
  SortAlphabetically,
  SortReverseAlphabetically,
  PriceRangeChange,
  priceRange,
}: FilterProps) {
  const [showCategories, setShowCategories] = useState(false);

  const toggleCategoriesVisibility = useCallback(async () => {
    setShowCategories(!showCategories);
  }, [showCategories]);

  const handleCategoryClick = (category: Category) => {
    onSelectCategory(category), toggleCategoriesVisibility();
  };

  const handleReset = () => {
    onSelectCategory(null);
  };

  return (
    <>
      <div className="hidden xl:block w-full p-4 pb-10">
        <div className="w-full flex justify-center h-[4rem] items-center">
          <h2 className="uppercase text-xl">Filtres</h2>
        </div>
        <Separator className="bg-white h-[2px]" />
        <div className="mt-12 space-y-8">
          <div className="flex w-full relative">
            <Accordion
              className="flex w-full relative"
              type="single"
              collapsible
            >
              <AccordionItem value="item-1">
                <AccordionTrigger className="font-Noto">
                  Category
                </AccordionTrigger>
                <ul className="w-full">
                  {categories.map((category) => {
                    return (
                      <>
                        <AccordionContent
                          onClick={() => handleCategoryClick(category)}
                          className="cursor-pointer"
                        >
                          <div className="text-xs font-Noto uppercase">
                            {category.name}
                          </div>
                        </AccordionContent>
                      </>
                    );
                  })}
                </ul>
              </AccordionItem>
            </Accordion>
            {selectedCategory && (
              <div
                onClick={handleReset}
                className="absolute top-5 right-0 cursor-pointer"
              >
                <RxCross2 size={15} />
              </div>
            )}
          </div>
          <div className="flex w-full relative">
            <Accordion
              className="flex w-full relative"
              type="single"
              collapsible
            >
              <AccordionItem value="item-1">
                <AccordionTrigger className="font-Noto">
                  Couleur
                </AccordionTrigger>
                <ul className="w-full">
                  {colors.map((color) => {
                    return (
                      <>
                        <AccordionContent
                          onClick={() => handleColorClick(color)}
                          className="cursor-pointer"
                        >
                          <div className="text-xs font-Noto uppercase">
                            {color.name}
                          </div>
                        </AccordionContent>
                      </>
                    );
                  })}
                </ul>
              </AccordionItem>
            </Accordion>
            {selectedCategory && (
              <div
                onClick={handleReset}
                className="absolute top-5 right-0 cursor-pointer"
              >
                <RxCross2 size={15} />
              </div>
            )}
          </div>
          <div className="w-full flex flex-col space-y-3">
            <div className="w-full flex space-x-8">
              <p className="cursor-pointer" onClick={SortAlphabetically}>
                Ordre A-Z
              </p>
              <p className="cursor-pointer" onClick={SortReverseAlphabetically}>
                Ordre Z-A
              </p>
            </div>
            <span className="h-[1.5px] bg-white/70 px-24"></span>
          </div>
          <div className="space-y-3">
            <div className="space-x-2 flex items-center">
              <p> Prix : </p>
              <p className="text-sm mt-[1px]">
                {formatPrice(priceRange, "EUR")}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <p className="text-xs">0 €</p>
              <input
                type="range"
                min="1"
                max="50000"
                value={priceRange}
                onChange={PriceRangeChange}
                className="appearance-none"
              />
              <p className="text-xs">500 €</p>
            </div>
          </div>
        </div>
      </div>
      <div className="block xl:hidden">
        <Sheet>
          <SheetTrigger>
            <div className="flex items-center uppercase bg-zinc-800 h-full px-3 py-2">
              Filtres
              <BsCaretDownFill size={15} className={`ml-2 `} />
            </div>
          </SheetTrigger>
          <SheetContent side="left" className="w-full md:w-[400px]">
            <SheetHeader>
              <SheetDescription>
                <div className="w-full flex justify-center h-[4rem] items-center">
                  <h2 className="uppercase text-xl">Filtres</h2>
                </div>
                <Separator className="bg-white h-[2px]" />
                <div className="mt-12 space-y-8">
                  <div className="flex w-full relative">
                    <Accordion
                      className="flex w-full relative"
                      type="single"
                      collapsible
                    >
                      <AccordionItem value="item-1">
                        <AccordionTrigger className="font-Noto">
                          Category
                        </AccordionTrigger>
                        <ul className="w-full">
                          {categories.map((category) => {
                            return (
                              <>
                                <AccordionContent
                                  onClick={() => handleCategoryClick(category)}
                                  className="cursor-pointer"
                                >
                                  <div className="text-start text-xs font-Noto uppercase">
                                    {category.name}
                                  </div>
                                </AccordionContent>
                              </>
                            );
                          })}
                        </ul>
                      </AccordionItem>
                    </Accordion>
                    {selectedCategory && (
                      <div
                        onClick={handleReset}
                        className="absolute top-5 right-0 cursor-pointer"
                      >
                        <RxCross2 size={15} />
                      </div>
                    )}
                  </div>
                  <div className="w-full flex flex-col space-y-3">
                    <div className="w-full flex space-x-8">
                      <p
                        className="cursor-pointer"
                        onClick={SortAlphabetically}
                      >
                        Ordre A-Z
                      </p>
                      <p
                        className="cursor-pointer"
                        onClick={SortReverseAlphabetically}
                      >
                        Ordre Z-A
                      </p>
                    </div>
                    <span className="h-[1.5px] bg-white/70 px-24"></span>
                  </div>
                  <div className="space-y-3">
                    <div className="space-x-2 flex items-center">
                      <p> Prix : </p>
                      <p className="text-sm mt-[1px]">
                        {formatPrice(priceRange, "EUR")}
                      </p>
                    </div>
                    <div className="flex items-center space-x-4">
                      <p className="text-xs">0 €</p>
                      <input
                        type="range"
                        min="1"
                        max="50000"
                        value={priceRange}
                        onChange={PriceRangeChange}
                        className="appearance-none"
                      />
                      <p className="text-xs">500 €</p>
                    </div>
                  </div>
                </div>
              </SheetDescription>
            </SheetHeader>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
