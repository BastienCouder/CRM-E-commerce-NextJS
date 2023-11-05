"use client";
import { useState, useCallback } from "react";
import { Product, ProductVariant, Category } from "@prisma/client";

import ProductMobile from "./ProductMobile";
import ProductDesktop from "./ProductDesktop";
import ProductTablet from "./ProductTablet";
import { WishlistItemsProps } from "@/lib/db/wishlist";

interface ProductProps {
  wishlistItems: WishlistItemsProps[] | undefined;
  product: Product & {
    variants: ProductVariant[];
    category: Category | null;
  };
  products: {
    id: string;
    description: string;
    imageUrl: string;
    name: string;
    price: number;
    createdAt: Date;
    updatedAt: Date;
    categoryId: string | null;
    category: {
      id: string;
      name: string;
    } | null;
  }[];
}

export default function Product({
  product,
  products,
  wishlistItems,
}: ProductProps) {
  const [showColor, setShowColor] = useState(false);
  const [selectedColor, setSelectedColor] = useState(
    product?.variants[0]?.id || null
  );
  const [showCategories, setShowCategories] = useState(false);

  const toggleColorVisibility = useCallback(async () => {
    setShowColor(!showColor);
  }, [showColor]);

  const toggleCategoriesVisibility = useCallback(async () => {
    setShowCategories(!showCategories);
  }, [showCategories]);

  const handleColorChange = (color: string) => {
    setSelectedColor(color);
    toggleColorVisibility();
  };
  const selectedVariant = product.variants.find(
    (variant: ProductVariant) => variant.id === selectedColor
  );

  const productCategory = product ? product.category?.name : null;

  const ProductPagesProps = {
    productCategory,
    showCategories,
    wishlistItems,
    showColor,
    products,
    selectedColor,
    selectedVariant,
    product,
    toggleColorVisibility,
    toggleCategoriesVisibility,
    handleColorChange,
  };

  return (
    <>
      <div className="block productTablet:hidden ">
        <ProductMobile {...ProductPagesProps} />
      </div>
      <div className="hidden productTablet:block productDesktop:hidden">
        <ProductTablet {...ProductPagesProps} />
      </div>
      <div className="hidden productTablet:hidden productDesktop:block">
        <ProductDesktop {...ProductPagesProps} />
      </div>
    </>
  );
}
