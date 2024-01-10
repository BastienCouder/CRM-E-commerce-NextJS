"use client";
import { useState, useCallback } from "react";
import ProductMobile from "./product-mobile";
import ProductDesktop from "./product-desktop";
import ProductTablet from "./product-tablet";
import { Dictionary } from "@/lang/dictionaries";
import { CartItem, Product, WishlistItem } from "@/schemas/db-schema";
import NavigationButtons from "./navigation-buttons";
import { useRouter } from "next/navigation";
import { useAnimationContext } from "@/context/AnimationContext";

interface InterfaceProductProps {
  wishlistItems: WishlistItem[] | undefined;
  product: Product;
  products: Product[];
  cartItems: CartItem[];
  dict: Dictionary;
}

export default function InterfaceProduct({
  product,
  products,
  wishlistItems,
  cartItems,
  dict,
}: InterfaceProductProps) {
  const [currentIndex, setCurrentIndex] = useState(
    products.findIndex((p) => p.id === product.id)
  );
  const router = useRouter();

  const [showCategories, setShowCategories] = useState(false);

  const toggleCategoriesVisibility = useCallback(async () => {
    setShowCategories(!showCategories);
  }, [showCategories]);

  const goToPrevProduct = () => {
    const newIndex = currentIndex > 0 ? currentIndex - 1 : products.length - 1;
    setCurrentIndex(newIndex);
    const newProduct = products[newIndex];
    router.push(`/products/${newProduct.name}`);
  };

  const goToNextProduct = () => {
    const newIndex = (currentIndex + 1) % products.length;
    setCurrentIndex(newIndex);
    const newProduct = products[newIndex];
    router.push(`/products/${newProduct.name}`);
  };

  const productCategory = product ? product.category.name : null;

  const { disableAnimation, setDisableAnimation } = useAnimationContext();
  const handleSecondAnimation = () => {
    if (!disableAnimation) {
      setDisableAnimation(true);
    }
  };

  const ProductPagesProps = {
    dict,
    disableAnimation,
    productCategory,
    showCategories,
    wishlistItems,
    products,
    cartItems,
    product,
    handleSecondAnimation,
    toggleCategoriesVisibility,
  };

  return (
    <>
      <section className="block productTablet:hidden">
        <section className="w-full flex">
          <ProductMobile {...ProductPagesProps} />
        </section>
      </section>
      <div className="hidden productTablet:block productDesktop:hidden">
        <section className="w-full flex">
          <ProductTablet {...ProductPagesProps} />
        </section>
      </div>
      <div className="hidden productTablet:hidden productDesktop:block">
        <NavigationButtons
          goToPrev={goToPrevProduct}
          goToNext={goToNextProduct}
          handleSecondAnimation={handleSecondAnimation}
        >
          <section className="h-screen w-full flex">
            <ProductDesktop {...ProductPagesProps} />
          </section>
        </NavigationButtons>
      </div>
    </>
  );
}
