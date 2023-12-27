"use client";
import { useState, useCallback } from "react";
import { Product } from "@prisma/client";
import ProductMobile from "./ProductMobile";
import ProductDesktop from "./ProductDesktop";
import ProductTablet from "./ProductTablet";
import { Dictionary } from "@/app/lang/dictionaries";
import { WishlistItem } from "@/lib/DbSchema";

interface InterfaceProductProps {
  wishlistItems: WishlistItem[] | undefined;
  product: Product;
  products: Product[];
  cartItems: any;
  dict: Dictionary;
}

export default function InterfaceProduct({
  product,
  products,
  wishlistItems,
  cartItems,
  dict,
}: InterfaceProductProps) {
  const [showColor, setShowColor] = useState(false);

  const [showCategories, setShowCategories] = useState(false);

  const toggleColorVisibility = useCallback(async () => {
    setShowColor(!showColor);
  }, [showColor]);

  const toggleCategoriesVisibility = useCallback(async () => {
    setShowCategories(!showCategories);
  }, [showCategories]);

  const productCategory = product ? product.category : null;

  const ProductPagesProps = {
    dict,
    productCategory,
    showCategories,
    wishlistItems,
    showColor,
    products,
    cartItems,
    product,
    toggleColorVisibility,
    toggleCategoriesVisibility,
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
