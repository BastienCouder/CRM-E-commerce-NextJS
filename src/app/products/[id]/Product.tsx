"use client";
import { AnimatePresence, motion } from "framer-motion";
import { useState, useCallback, useEffect } from "react";
import Image from "next/image";
import PriceTag from "@/components/PriceTag";
import AddToCartButton from "./AddToCartButton";
import AddToWishlist from "./AddToWishlist";
import { AiOutlinePlus } from "react-icons/ai";
import { Product, ProductVariant, Like } from "@prisma/client";
import useMobile from "@/hooks/useMobile";
import { BsCaretDownFill } from "react-icons/bs";
import { Session } from "next-auth";

interface ProductProps {
  session: Session | null;
  product: Product & {
    variants: ProductVariant[];
  };
  like: Like | null;
  incrementProductQuantity: (
    productId: string,
    variantId: string
  ) => Promise<void>;
  incrementWishlist: (
    productId: string,
    variantId: string | null,
    userId: string
  ) => Promise<void>;
}
export default function Product({
  session,
  product,
  like,
  incrementProductQuantity,
  incrementWishlist,
}: ProductProps) {
  const [showColor, setShowColor] = useState(false);
  const [selectedColor, setSelectedColor] = useState(
    product?.variants[0]?.id || null
  );
  const ismobile = useMobile();

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
      {ismobile ? (
        <>
          <div className="flex h-full py-16 justify-center">
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
                className="flex flex-col mt-8 gap-y-8 mx-10"
              >
                <div className="flex flex-col gap-4">
                  <h2 className="text-3xl text-center">Description</h2>
                  <p className="w-full">{product.description}</p>
                </div>
                <PriceTag
                  price={
                    selectedVariant?.price
                      ? selectedVariant?.price
                      : product.price
                  }
                  className="text-xl text-center font-bold"
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
      ) : (
        <>
          <div className="h-screen w-full flex">
            <div className="h-full w-1/5 bg-white"></div>

            <div className="flex w-4/5">
              <div className="h-full w-1/3 bg-zinc-900 flex justify-end pr-6 items-center">
                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ delay: 0.4, duration: 0.6 }}
                  className="flex flex-col items-end gap-4"
                >
                  <h2 className="text-3xl relative">
                    Description
                    <span className="w-[8rem] h-[1px] bg-white absolute bottom-4 ml-4"></span>
                  </h2>
                  <p className="w-full">{product.description}</p>
                </motion.div>
              </div>
              <div className="h-full w-1/3 bg-zinc-800">
                <div className="h-full pb-20 justify-end relative flex flex-col">
                  <motion.div key={selectedColor}>
                    {selectedVariant ? (
                      <Image
                        src={
                          selectedVariant.imageUrl
                            ? selectedVariant.imageUrl
                            : product.imageUrl
                        }
                        alt={product.name}
                        width={800}
                        height={2000}
                        className="z-20 h-[30rem] object-cover absolute top-10"
                      />
                    ) : (
                      <Image
                        src={product.imageUrl}
                        alt={product.name}
                        width={800}
                        height={2000}
                        className="z-20 h-[30rem] object-cover absolute top-10"
                      />
                    )}
                  </motion.div>

                  <motion.div
                    className="font-Bodoni absolute text-[5rem] top-48 -left-32  uppercase text-white/5"
                    initial={{ opacity: 0, x: 50, rotate: -90 }}
                    animate={{ opacity: 1, x: 0, rotate: -90 }}
                    exit={{ opacity: 0, x: 50, rotate: -90 }}
                    transition={{ delay: 0.4, duration: 0.6 }}
                  >
                    {product.name}
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 50 }}
                    transition={{ delay: 0.2, duration: 0.6 }}
                    className="flex justify-center items-center flex-col gap-y-8"
                  >
                    <div className="w-full flex justify-center px-16">
                      <div className="bg-white h-[1px] w-1/2"></div>
                      <h1 className="text-center w-full mx-4 -mt-3 font-Noto uppercase">
                        {product.name}
                      </h1>
                      <div className="bg-white h-[1px] w-1/2"></div>
                    </div>{" "}
                  </motion.div>
                </div>
              </div>
              <div className="h-full w-1/3 bg-zinc-700 flex justify-start pl-6 items-center">
                <div className="flex flex-col items-start gap-4">
                  <motion.div
                    initial={{ opacity: 0, x: 30, y: 0 }}
                    animate={{ opacity: 1, x: 0, y: 0 }}
                    exit={{ opacity: 0, x: 30, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.4 }}
                  >
                    <h2
                      onClick={toggleColorVisibility}
                      className="cursor-pointer text-3xl justify-center items-center relative flex row-reverse"
                    >
                      Couleur <BsCaretDownFill size={15} className="ml-2" />
                      <span className="w-[8rem] h-[1px] bg-white absolute bottom-4 -left-[8.8rem]"></span>
                    </h2>
                    <p className="uppercase text-xs">
                      {selectedVariant?.color}
                    </p>
                    {session?.user?.id && (
                      <AddToWishlist
                        productId={product.id}
                        variantId={selectedVariant?.id}
                        incrementWishlist={incrementWishlist}
                        userId={session?.user?.id}
                        like={like}
                      />
                    )}
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 50 }}
                    transition={{ delay: 0.4, duration: 0.6 }}
                    className="flex flex-col mt-8 gap-y-8"
                  >
                    <PriceTag
                      price={
                        selectedVariant?.price
                          ? selectedVariant?.price
                          : product.price
                      }
                      className="text-xl text-start font-bold"
                    />
                    <div className="flex flex-col">
                      <AddToCartButton
                        productId={product.id}
                        incrementProductQuantity={incrementProductQuantity}
                        variantId={selectedVariant?.id || ""}
                      />
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>
            <AnimatePresence>
              {showColor ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="z-20 fixed top-0 h-screen w-screen flex justify-center items-center bg-zinc-900/90"
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
          </div>
        </>
      )}
    </>
  );
}
