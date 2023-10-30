"use client";
import { useState, useCallback } from "react";
import { Product, ProductVariant, Like, Category } from "@prisma/client";
import useMobile from "@/hooks/useMobile";
import { Session } from "next-auth";
import useTablet from "@/hooks/useTablet";
import ProductMobile from "./ProductMobile";
import ProductDesktop from "./ProductDesktop";
import ProductTablet from "./ProductTablet";
import { ShoppingLike } from "@/lib/db/like";
import { useServerAddToCart, useServerAddWishlist } from "./actions";

interface ProductProps {
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
  like: ShoppingLike | null;
}

export default function Product({ product, products, like }: ProductProps) {
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

  const isMobile = useMobile();
  const isTablet = useTablet();

  const handleColorChange = (color: string) => {
    setSelectedColor(color);
    toggleColorVisibility();
  };
  const selectedVariant = product.variants.find(
    (variant: any) => variant.id === selectedColor
  );

  return (
    <>
      {isMobile && !isTablet ? (
        <ProductMobile
          like={like}
          products={products}
          showColor={showColor}
          showCategories={showCategories}
          selectedColor={selectedColor}
          selectedVariant={selectedVariant}
          product={product}
          toggleColorVisibility={toggleColorVisibility}
          handleColorChange={handleColorChange}
          toggleCategoriesVisibility={toggleCategoriesVisibility}
        />
      ) : isTablet ? (
        <>
          <ProductTablet
            like={like}
            products={products}
            showColor={showColor}
            showCategories={showCategories}
            selectedColor={selectedColor}
            selectedVariant={selectedVariant}
            product={product}
            toggleColorVisibility={toggleColorVisibility}
            handleColorChange={handleColorChange}
            toggleCategoriesVisibility={toggleCategoriesVisibility}
          />
        </>
      ) : (
        <ProductDesktop
          like={like}
          showColor={showColor}
          products={products}
          selectedColor={selectedColor}
          selectedVariant={selectedVariant}
          product={product}
          toggleColorVisibility={toggleColorVisibility}
          handleColorChange={handleColorChange}
        />
      )}
    </>
  );
}
