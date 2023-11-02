"use client";
import CardProduct from "./CardProduct";
import Filter from "./Filter";
import { useState } from "react";
import { Category, Product, Color } from "@prisma/client";
import { Separator } from "@/components/ui/separator";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface CollectionPageProps {
  products: (Product & { category: Category | null })[];
  categories: Category[];
  colors: Color[];
}
export default function CollectionPage({
  products,
  categories,
  colors,
}: CollectionPageProps) {
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );
  const [selectedColor, setSelectedColor] = useState<Color | null>(null);
  const [sortedProducts, setSortedProducts] = useState([...products]);
  const [priceRange, setPriceRange] = useState<number>(50000);

  const handleCategorySelect = (category: Category | null) => {
    setSelectedCategory(category);
  };
  const handleColorSelect = (color: Color | null) => {
    setSelectedColor(color);
  };

  const [selectedSort, setSelectedSort] = useState("A-Z");

  const handleSortAlphabetically = () => {
    setSortedProducts(
      [...products].sort((a, b) => a.name.localeCompare(b.name))
    );
    setSelectedSort("A-Z");
  };

  const handleSortReverseAlphabetically = () => {
    setSortedProducts(
      [...products].sort((a, b) => b.name.localeCompare(a.name))
    );
    setSelectedSort("Z-A");
  };

  const handlePriceRangeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPriceRange = parseInt(e.target.value, 10);
    setPriceRange(newPriceRange);
  };
  const filteredProducts = sortedProducts.filter((product) => {
    if (
      (selectedCategory && product.categoryId !== selectedCategory.id) ||
      (selectedColor && product.colorsId !== selectedColor.id)
    ) {
      return false;
    }
    return product.price <= priceRange;
  });

  return (
    <div className="w-full flex flex-col xl:h-full xl:pt-10">
      <h1 className="text-4xl text-start pl-20 mt-6 mb-12">Collection</h1>
      <div className="w-full flex flex-col xl:flex-row">
        <div className="xl:bg-zinc-800 xl:h-screen px-4">
          <Filter
            categories={categories}
            colors={colors}
            selectedCategory={selectedCategory}
            selectedColor={selectedColor}
            onSelectColor={handleColorSelect}
            onSelectCategory={handleCategorySelect}
            priceRange={priceRange}
            PriceRangeChange={handlePriceRangeChange}
          />
        </div>

        <div className="mt-4 xl:w-3/4 mx-20 xl:mx-0 xl:mr-12 flex flex-col xl:pl-20 ">
          <div className="mb-4 w-full flex flex-col md:flex-row gap-y-4 md:gap-0 md:justify-between items-start relative pr-10">
            <div className="font-bold">
              Produits : <span>{products.length}</span>
            </div>
            <Accordion className="-mt-4 w-[10rem]" type="single" collapsible>
              <AccordionItem value="item-1" className="relative">
                <AccordionTrigger className="font-Noto">Trier</AccordionTrigger>
                <AccordionContent>
                  <p
                    className={`cursor-pointer ${
                      selectedSort === "A-Z" ? "text-amber-600" : "text-white"
                    }`}
                    onClick={handleSortAlphabetically}
                  >
                    Ordre A-Z
                  </p>
                </AccordionContent>
                <AccordionContent>
                  <p
                    className={`cursor-pointer ${
                      selectedSort === "Z-A" ? "text-amber-600" : "text-white"
                    }`}
                    onClick={handleSortReverseAlphabetically}
                  >
                    Ordre Z-A
                  </p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
          <Separator />
          <div className="mt-4 w-full h-[40rem] overflow-y-auto pb-4 flex justify-center lg:justify-start flex-wrap gap-8">
            {filteredProducts.map((product) => (
              <CardProduct
                product={product}
                key={product.id}
                selectedCategory={selectedCategory}
                selectedColor={selectedColor}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
