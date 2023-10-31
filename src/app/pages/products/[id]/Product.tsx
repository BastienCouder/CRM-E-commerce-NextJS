"use client";
import { useState, useCallback } from "react";
import { Product, ProductVariant, Like, Category } from "@prisma/client";
import useMobile from "@/hooks/useMobile";
import useTablet from "@/hooks/useTablet";
import ProductMobile from "./ProductMobile";
import ProductDesktop from "./ProductDesktop";
import ProductTablet from "./ProductTablet";

interface ProductProps {
  wishlistItems: any;
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

  const isMobile = useMobile();
  const isTablet = useTablet();
  const handleColorChange = (color: string) => {
    setSelectedColor(color);
    toggleColorVisibility();
  };
  const selectedVariant = product.variants.find(
    (variant: any) => variant.id === selectedColor
  );

  const ProductPagesProps = {
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
      {isMobile && !isTablet ? (
        <ProductMobile {...ProductPagesProps} />
      ) : isTablet ? (
        <>
          <ProductTablet {...ProductPagesProps} />
        </>
      ) : (
        <ProductDesktop {...ProductPagesProps} />
      )}
    </>
  );
}
