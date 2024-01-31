"use client";
import { useState } from "react";
import { Separator } from "@/components/ui/separator";
import { motion } from "framer-motion";
import { Color, Product, Category } from "@/schemas/db-schema";
import CardProduct from "@/components/shop/card-product";
import StoreListHeader from "@/components/shop/store-list-header";
import { Dictionary } from "@/lang/dictionaries";

interface InterfaceStoreProps {
  products: Product[];
  colors: Color[];
  dict: Dictionary;
}

export default function InterfaceStore({
  products,
  colors,
  dict,
}: InterfaceStoreProps) {
  const [filterData, setFilterData] = useState({
    selectedColor: null as Color | null,
    sortedProducts: [...products] as Product[],
    priceRange: 50000,
    searchTerm: "",
    selectedSort: "A-Z",
  });

  const {
    selectedColor,
    sortedProducts,
    priceRange,
    searchTerm,
    selectedSort,
  } = filterData;

  const sortProducts = (order: "A-Z" | "Z-A") => {
    const sorted = [...products].sort((a, b) =>
      order === "A-Z"
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name)
    );
    setFilterData({
      ...filterData,
      sortedProducts: sorted,
      selectedSort: order,
    });
  };

  const handleSortAlphabetically = () => {
    sortProducts("A-Z");
  };

  const handleSortReverseAlphabetically = () => {
    sortProducts("Z-A");
  };

  const handlePriceRangeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPriceRange = parseInt(e.target.value, 10);
    setFilterData({ ...filterData, priceRange: newPriceRange });
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilterData({ ...filterData, searchTerm: e.target.value });
  };

  const handleColorSelect = (color: Color | null) => {
    setFilterData({ ...filterData, selectedColor: color });
  };

  const filteredProducts = sortedProducts
    .filter((product) => {
      if (selectedColor && product.color !== selectedColor) {
        return false;
      }
      return product.price <= priceRange;
    })
    .filter((product) => {
      return product.name.toLowerCase().includes(searchTerm.toLowerCase());
    });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full flex flex-col"
    >
      <div className="mt-4 w-full flex flex-col">
        <StoreListHeader
          searchTerm={searchTerm}
          onSearchChange={handleSearch}
          selectedSort={selectedSort}
          onSortAlphabetically={handleSortAlphabetically}
          onSortReverseAlphabetically={handleSortReverseAlphabetically}
          colors={colors}
          selectedColor={selectedColor}
          onSelectColor={handleColorSelect}
          priceRange={priceRange}
          PriceRangeChange={handlePriceRangeChange}
        />

        <Separator />
        <div className="bg-card"></div>
        <ul className="px-4 gap-y-4 w-full flex justify-center lg:justify-start flex-wrap">
          {filteredProducts.map((product, index) => (
            <li
              key={index}
              className="w-full md:w-1/2 lg:w-1/4 p-2 pt-8 border-b border-foreground"
            >
              <CardProduct
                product={product}
                selectedColor={selectedColor}
                dict={dict}
              />
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
}
