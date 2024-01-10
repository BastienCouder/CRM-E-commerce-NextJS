"use client";

import Search from "@/components/shop/search";
import { ChangeEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { Color } from "@/schemas/db-schema";
import Filter from "./filter";

interface StoreListHeaderProps {
  searchTerm: string;
  onSearchChange: (e: ChangeEvent<HTMLInputElement>) => void;
  selectedSort: string;
  onSortAlphabetically: () => void;
  onSortReverseAlphabetically: () => void;
  colors: Color[];
  onSelectColor: (category: Color | null) => void;
  selectedColor: Color | null;
  priceRange: number;
  PriceRangeChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function StoreListHeader({
  searchTerm,
  onSearchChange,
  selectedSort,
  onSortAlphabetically,
  onSortReverseAlphabetically,
  colors,
  onSelectColor,
  selectedColor,
  priceRange,
  PriceRangeChange,
}: StoreListHeaderProps) {
  return (
    <section className="mb-4 w-full lg:w-2/3 flex flex-col lg:flex-row gap-y-4 lg:gap-0 jsutify-center lg:justify-between items-center relative">
      <div className="h-12 lg:w-1/5">
        <Link href={"/"}>
          <Image
            src={"/svg/logo.svg"}
            alt="logo"
            height={400}
            width={240}
            className="-mt-6 lg:-mt-12 lg:h-[160px] h-[120px] w-[120px] lg:w-full lg:aspect-square lg:object-contain object-cover"
          />
        </Link>
      </div>
      <div className="w-4/5 flex flex-col lg:flex-row gap-4">
        <Search searchTerm={searchTerm} onSearchChange={onSearchChange} />
        <Filter
          colors={colors}
          selectedColor={selectedColor}
          onSelectColor={onSelectColor}
          priceRange={priceRange}
          PriceRangeChange={PriceRangeChange}
          onSortAlphabetically={onSortAlphabetically}
          onSortReverseAlphabetically={onSortReverseAlphabetically}
          selectedSort={selectedSort}
        />
      </div>
    </section>
  );
}
