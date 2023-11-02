"use client";
import CardProduct from "./CardProduct";
import Filter from "./Filter";
import { useState } from "react";
import { Category, Product } from "@prisma/client";

interface CollectionPageProps {
  products: (Product & { category: Category | null })[];
  categories: Category[];
}
export default function CollectionPage({
  products,
  categories,
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
  const handleColorSelect = (category: Category | null) => {
    setSelectedCategory(category);
  };

  const handleSortAlphabetically = () => {
    setSortedProducts(
      [...products].sort((a, b) => a.name.localeCompare(b.name))
    );
  };

  const handleSortReverseAlphabetically = () => {
    setSortedProducts(
      [...products].sort((a, b) => b.name.localeCompare(a.name))
    );
  };

  const handlePriceRangeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPriceRange = parseInt(e.target.value, 10);
    setPriceRange(newPriceRange);
  };
  const filteredProducts = sortedProducts.filter((product) => {
    if (selectedCategory && product.category?.id !== selectedCategory.id) {
      return false;
    }
    return product.price <= priceRange;
  });

  return (
    <div className="w-full flex flex-col xl:h-full xl:pt-10">
      <h1 className="text-4xl text-center my-8">Collection</h1>
      <div className="w-full flex flex-col xl:flex-row">
        <div className="xl:w-1/4 xl:bg-zinc-800 xl:h-screen">
          <Filter
            categories={categories}
            selectedCategory={selectedCategory}
            selectedColor={selectedColor}
            onSelectColor={handleColorSelect}
            onSelectCategory={handleCategorySelect}
            SortAlphabetically={handleSortAlphabetically}
            SortReverseAlphabetically={handleSortReverseAlphabetically}
            priceRange={priceRange}
            PriceRangeChange={handlePriceRangeChange}
          />
        </div>

        <div className="overflow-y-auto pb-4 xl:pl-20 xl:w-3/4 flex justify-center lg:justify-start flex-wrap gap-x-8">
          {filteredProducts.map((product) => (
            <CardProduct
              product={product}
              key={product.id}
              selectedCategory={selectedCategory}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
