"use client";
import CardProduct from "./CardProduct";
import Filter from "./Filter";
import { useState } from "react";
import { Category, Product, Color, ProductVariant } from "@prisma/client";
import { Separator } from "@/components/ui/separator";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { AiOutlineSearch } from "react-icons/ai";

interface CollectionPageProps {
  products: (Product & {
    category: Category | null;
    variants: ProductVariant[] | null;
  })[];
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
  const [searchTerm, setSearchTerm] = useState("");

  const handleCategorySelect = (category: Category | null) => {
    setSelectedCategory(category);
  };
  const handleColorSelect = (color: Color | null) => {
    setSelectedColor(color);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
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

  const filteredProducts = sortedProducts
    .filter((product) => {
      if (
        (selectedCategory && product.categoryId !== selectedCategory.id) ||
        (selectedColor && product.colorsId !== selectedColor.id)
      ) {
        return false;
      }
      return product.price <= priceRange;
    })
    .filter((product) => {
      return product.name.toLowerCase().includes(searchTerm.toLowerCase());
    });

  return (
    <div className="w-full flex flex-col md:pt-10">
      <div className="w-full flex flex-col xl:flex-row">
        <div className="bg-[#191919] xl:block hidden px-4">
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

        <div className="mt-4 xl:w-3/4 mx-8 md:mx-20 xl:mx-0 xl:mr-12 flex flex-col xl:pl-20 ">
          <div className="mb-4 w-full flex flex-col md:flex-row gap-y-4 md:gap-0 md:justify-between items-start relative">
            <div className="md:hidden w-full space-y-1 relative">
              <Input
                className="w-full md:w-[20rem] bg-zinc-800 p-2 border-none outline-none text-white"
                type="text"
                value={searchTerm}
                onChange={handleSearch}
                placeholder="Rechercher..."
              />
              <div className="absolute text-zinc-900 top-1.5 right-0 px-2 outline-none text-xl cursor-pointer">
                <AiOutlineSearch size={20} className="text-white mr-1" />
              </div>
            </div>

            <div className="font-bold">
              Produits : <span>{products.length}</span>
            </div>
            <div className="hidden md:block space-y-1 relative">
              <Input
                className="w-full md:w-[20rem] bg-zinc-800 p-2 border-none outline-none text-white"
                type="text"
                value={searchTerm}
                onChange={handleSearch}
                placeholder="Rechercher..."
              />
              <div className="absolute text-zinc-900 top-1.5 right-0 px-2 outline-none text-xl cursor-pointer">
                <AiOutlineSearch size={20} className="text-white mr-1" />
              </div>
            </div>
            <Accordion className="-mt-4 w-[10rem]" type="single" collapsible>
              <AccordionItem value="item-1" className="relative">
                <AccordionTrigger className="text-sm md:text-base font-Noto">
                  Trier
                </AccordionTrigger>
                <AccordionContent>
                  <p
                    className={`text-sm cursor-pointer ${
                      selectedSort === "A-Z" ? "text-amber-600" : "text-white"
                    }`}
                    onClick={handleSortAlphabetically}
                  >
                    Ordre A-Z
                  </p>
                </AccordionContent>
                <AccordionContent>
                  <p
                    className={`text-sm cursor-pointer ${
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
          <div className="xl:hidden">
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
          <ul className="mt-4 mb-8 xl:mb-0 w-full pb-4 flex justify-center lg:justify-start flex-wrap gap-8">
            {filteredProducts.map((product) => (
              <CardProduct
                product={product}
                key={product.id}
                selectedCategory={selectedCategory}
                selectedColor={selectedColor}
              />
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
