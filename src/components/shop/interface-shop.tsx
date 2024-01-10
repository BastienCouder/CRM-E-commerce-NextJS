"use client";
import { useState } from "react";
import { Separator } from "@/components/ui/separator";
import { motion } from "framer-motion";
import { Color, Product, Category } from "@/schemas/db-schema";
import CardProduct from "@/components/shop/card-product";
import StoreListHeader from "@/components/shop/store-list-header";
import { Dictionary } from "@/lang/dictionaries";
import Filter from "./filter";

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
      className="w-full flex flex-col md:pt-10"
    >
      <div className="w-full flex flex-col xl:flex-row">
        <div className="mt-4 xl:w-3/4 mx-8 md:mx-20 xl:mx-0 xl:mr-12 flex flex-col xl:pl-20 ">
          <StoreListHeader
            searchTerm={searchTerm}
            onSearchChange={handleSearch}
            productsCount={filteredProducts.length}
            selectedSort={selectedSort}
            onSortAlphabetically={handleSortAlphabetically}
            onSortReverseAlphabetically={handleSortReverseAlphabetically}
          />

          <Separator />
          <div className="bg-card">
            <Filter
              colors={colors}
              selectedColor={selectedColor}
              onSelectColor={handleColorSelect}
              priceRange={priceRange}
              PriceRangeChange={handlePriceRangeChange}
            />
          </div>
          <ul className="mt-4 mb-8 xl:mb-0 w-full pb-4 flex justify-center lg:justify-start flex-wrap gap-8">
            {filteredProducts.map((product) => (
              <CardProduct
                product={product}
                key={product.id}
                selectedColor={selectedColor}
                dict={dict}
              />
            ))}
          </ul>
        </div>
      </div>
    </motion.div>
  );
}
