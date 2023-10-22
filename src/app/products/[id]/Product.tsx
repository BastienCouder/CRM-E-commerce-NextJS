"use client";
import { AnimatePresence, motion } from "framer-motion";
import { useState, useCallback } from "react";
import Image from "next/image";
import PriceTag from "@/components/PriceTag";
import AddToCartButton from "./AddToCartButton";
import { AiOutlinePlus } from "react-icons/ai";
import { Product, ProductVariant } from "@prisma/client";

interface ProductProps {
  product: Product & {
    variants: ProductVariant[];
  };
  incrementProductQuantity: (
    productId: string,
    variantId: string
  ) => Promise<void>;
}
export default function Product({
  product,
  incrementProductQuantity,
}: ProductProps) {
  const [showColor, setShowColor] = useState(false);
  const [selectedColor, setSelectedColor] = useState(product.variants[0].id);

  const toggleColorVisibility = useCallback(async () => {
    setShowColor(!showColor);
  }, [showColor]);

  const handleColorChange = (color: string) => {
    setSelectedColor(color);
    toggleColorVisibility();
  };

  const selectedVariant = product.variants.find(
    (variant: any) => variant.id === selectedColor
  );

  return (
    <>
      <div className="flex h-full py-16">
        <div className="flex flex-col">
          <div className="relative">
            <motion.div
              key={selectedColor}
              initial={{ opacity: 0.5, y: -500 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
            >
              {selectedVariant && (
                <Image
                  src={
                    selectedVariant.imageUrl
                      ? selectedVariant.imageUrl
                      : product.imageUrl
                  }
                  alt={product.name}
                  width={500}
                  height={1000}
                  className="z-10 h-[28rem] object-contain"
                />
              )}
            </motion.div>

            <motion.div
              className="font-Bodoni absolute text-[4.5rem] top-32 -left-24 sm:-left-20 uppercase text-white/5"
              initial={{ opacity: 0, x: 50, rotate: -90 }}
              animate={{ opacity: 1, x: 0, rotate: -90 }}
              exit={{ opacity: 0, x: 50, rotate: -90 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              {product.name}
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30, y: 0 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              exit={{ opacity: 0, x: 30, y: 0 }}
              transition={{ delay: 0.3, duration: 0.4 }}
              className="z-10 absolute top-10 right-10 "
            >
              <div
                onClick={toggleColorVisibility}
                className="cursor-pointer h-12 w-12 rounded-full bg-white/5 flex justify-center items-center"
              >
                <AiOutlinePlus size={20} />
              </div>
              <p className="absolute top-20 -right-1 -rotate-90 text-white/50">
                Couleur
              </p>
            </motion.div>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="flex justify-center items-center flex-col gap-y-8"
          >
            <h1 className="text-center w-full mx-8 font-Noto uppercase">
              {product.name}
            </h1>
            <span className="h-[1px] bg-white px-24"></span>
          </motion.div>
          {/* {product.category && <h2>{product.category.name}</h2>} */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="flex flex-col mt-8 gap-y-8 mx-12"
          >
            <div className="flex flex-col gap-4">
              <h2 className="text-3xl text-center">Description</h2>
              <p className="w-full">{product.description}</p>
            </div>
            <PriceTag
              price={
                selectedVariant?.price ? selectedVariant?.price : product.price
              }
              className="text-2xl text-center font-bold"
            />
            <AddToCartButton
              productId={product.id}
              incrementProductQuantity={incrementProductQuantity}
              variantId={selectedVariant?.id || ""}
            />
          </motion.div>
        </div>
      </div>

      <AnimatePresence>
        {showColor ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed top-0 h-screen w-screen flex justify-center items-center bg-zinc-900/80"
          >
            <ul className="flex flex-col gap-3 items-center justify-center uppercase">
              {product.variants.map((variant: ProductVariant) => (
                <motion.li
                  initial={{ opacity: 0.5, y: -50 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{
                    opacity: 0,
                    y: -50,
                  }}
                  transition={{ duration: 0.2 }}
                  key={variant.id}
                  className="cursor-pointer"
                  onClick={() => handleColorChange(variant.id)}
                >
                  {variant.color}
                </motion.li>
              ))}
            </ul>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
