"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import AddToCartButton from "@/components/actions/add-to-cart-button";
import PriceTag from "@/lib/helpers/PriceTag";
import AddToWishlist from "@/components/actions/add-to-wishlist";
import { Dictionary } from "@/lang/dictionaries";
import { CartItem, Product, WishlistItem } from "@/schemas/db-schema";
import { replaceUnderscoresWithSpaces } from "@/lib/utils";

interface ProductDesktopProps {
  wishlistItems: WishlistItem[] | undefined;
  products: Product[];
  product: Product;
  cartItems: CartItem[];
  dict: Dictionary;
  disableAnimation: any;
}

export default function ProductDesktop({
  wishlistItems,
  cartItems,
  product,
  dict,
  disableAnimation,
}: ProductDesktopProps) {
  return (
    <>
      <div className="h-full w-1/5 pt-32 pl-4">
        {!disableAnimation ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2, delay: 0.4 }}
            className="absolute w-[17rem] space-y-6"
          >
            <>
              <h1 className="text-4xl text-center w-full mx-8 -mt-3 uppercase">
                {product.name}
              </h1>
            </>
          </motion.div>
        ) : (
          <div className="absolute w-[17rem] space-y-6">
            <>
              <h1 className="text-4xl text-center w-full mx-8 -mt-3 uppercase">
                {product.name}
              </h1>
            </>
          </div>
        )}
      </div>

      <div className="flex w-4/5">
        {!disableAnimation ? (
          <div className="h-full w-1/3 flex justify-end pr-6 pt-[18rem]">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="flex flex-col items-end gap-4"
            >
              <h2 className="text-3xl relative">
                Description
                <span className="w-[8rem] h-[1px] bg-secondary absolute bottom-4 ml-4"></span>
              </h2>
              <p className="text-end w-5/6">{product.description}</p>
            </motion.div>
          </div>
        ) : (
          <div className="h-full w-1/3 flex justify-end pr-6 pt-[18rem]">
            <div className="flex flex-col items-end gap-4">
              <h2 className="text-3xl relative">
                Description
                <span className="w-[8rem] h-[1px] bg-secondary absolute bottom-4 ml-4"></span>
              </h2>
              <motion.p
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  type: "spring",
                  damping: 12,
                  stiffness: 100,
                  ease: [0.36, 0.61, 0.04, 1],
                  duration: 0.2,
                  delay: 0.1,
                }}
                className="text-end w-5/6"
              >
                {product.description}
              </motion.p>
            </div>
          </div>
        )}

        <div className="h-full w-1/3">
          {!disableAnimation ? (
            <div className="h-full pb-20 justify-end relative flex flex-col">
              <motion.figure
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.6 }}
              >
                <Image
                  src={product.imageUrl}
                  alt={product.name}
                  width={800}
                  height={2000}
                  className="z-20  h-[25rem] w-[25rem]  object-contain absolute top-24"
                />
              </motion.figure>

              <motion.div
                className="font-prata absolute text-[5rem] top-48 -left-32  uppercase text-[rgba(var(--foreground),0.2)]"
                initial={{ opacity: 0, x: 50, rotate: -90 }}
                animate={{ opacity: 1, x: 0, rotate: -90 }}
                transition={{ duration: 0.6 }}
              >
                {product.name}
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="flex justify-center items-center flex-col gap-y-4"
              >
                <div className="w-full flex justify-center pb-10 px-16">
                  <div className="bg-secondary h-[1px] w-1/2"></div>
                  <h2 className="text-center w-full mx-4 -mt-4 font-Noto uppercase">
                    {replaceUnderscoresWithSpaces(product.category.name)}
                  </h2>
                  <div className="bg-secondary h-[1px] w-1/2"></div>
                </div>
              </motion.div>
            </div>
          ) : (
            <div className="h-full pb-20 justify-end relative flex flex-col">
              <figure>
                <Image
                  src={product.imageUrl}
                  alt={product.name}
                  width={800}
                  height={2000}
                  className="z-20 h-[25rem] w-[25rem] object-contain absolute top-24"
                />
              </figure>

              <div className="font-prata absolute text-[5rem] top-48 -left-32  uppercase text-[rgba(var(--foreground),0.2)] -rotate-90">
                {product.name}
              </div>
              <div className="flex justify-center items-center flex-col gap-y-4">
                <div className="w-full flex justify-center pb-8 px-16">
                  <div className="bg-secondary h-[1px] w-1/2"></div>
                  <h2 className="text-center w-full mx-4 -mt-3 font-Noto uppercase">
                    {replaceUnderscoresWithSpaces(product.category.name)}
                  </h2>
                  <div className="bg-secondary h-[1px] w-1/2"></div>
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="h-full w-1/3 flex justify-start pl-6 -mt-[16rem]">
          {!disableAnimation ? (
            <div className="flex flex-col justify-end items-start gap-4">
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.4 }}
              >
                <h2 className="text-3xl justify-center items-center relative flex row-reverse">
                  Couleur
                  <span className="w-[10rem] h-[1px] bg-secondary absolute bottom-4 -left-[10.8rem]"></span>
                </h2>
                <motion.p
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2, duration: 0.2 }}
                  className="uppercase text-xs"
                >
                  {product.color}
                </motion.p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="flex flex-col mt-8 gap-y-8"
              >
                <div className="flex items-center space-x-4">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, delay: 0.2 }}
                  >
                    <PriceTag
                      price={product.price}
                      className="text-xl text-start font-bold"
                      locale={dict.locale}
                    />
                  </motion.div>
                  <AddToWishlist
                    cartItems={cartItems}
                    wishlistItems={wishlistItems}
                    productId={product.id}
                  />
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center justify-center gap-2">
                    <AddToCartButton productId={product.id} dict={dict} />
                  </div>
                </div>
              </motion.div>
            </div>
          ) : (
            <div className="flex flex-col justify-end items-start gap-4">
              <div>
                <h2 className="text-3xl justify-center items-center relative flex row-reverse">
                  Couleur
                  <span className="w-[10rem] h-[1px] bg-secondary absolute bottom-4 -left-[10.8rem]"></span>
                </h2>
                <motion.p
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4 }}
                  className="uppercase text-xs"
                >
                  {product.color}
                </motion.p>
              </div>
              <div className="flex flex-col mt-8 gap-y-8">
                <div className="flex items-center space-x-4">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      type: "spring",
                      damping: 12,
                      stiffness: 100,
                      ease: [0.36, 0.61, 0.04, 1],
                      duration: 0.2,
                      delay: 0.1,
                    }}
                  >
                    <PriceTag
                      price={product.price}
                      className="text-xl text-start font-bold"
                      locale={dict.locale}
                    />
                  </motion.div>

                  <AddToWishlist
                    cartItems={cartItems}
                    wishlistItems={wishlistItems}
                    productId={product.id}
                  />
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center justify-center gap-2">
                    <AddToCartButton productId={product.id} dict={dict} />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
