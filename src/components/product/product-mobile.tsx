"use client";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import AddToCartButton from "@/components/actions/add-to-cart-button";
import PriceTag from "@/lib/helpers/PriceTag";
import { Product } from "@prisma/client";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { RxCross2 } from "react-icons/rx";
import AddToWishlist from "@/components/actions/add-to-wishlist";
import {
  addProductToCart,
  addProductToWishlist,
} from "@/app/(pages)/products/[id]/actions";
import { BsCaretDownFill } from "react-icons/bs";
import { useAnimationContext } from "@/context/AnimationContext";
import styles from "@/styles/keyframes.module.css";
import { Dictionary } from "@/app/lang/dictionaries";
import { CartItem, WishlistItem } from "@/schemas/DbSchema";

interface ProductMobileProps {
  cartItems: CartItem[];
  wishlistItems: WishlistItem[] | undefined;
  productCategory: string | null | undefined;
  products: Product[];
  showColor: boolean;
  showCategories: boolean;
  product: Product;
  toggleColorVisibility: () => Promise<void>;
  toggleCategoriesVisibility: () => Promise<void>;
  dict: Dictionary;
}

export default function ProductMobile({
  wishlistItems,
  cartItems,
  products,
  showColor,
  productCategory,
  showCategories,
  product,
  toggleColorVisibility,
  toggleCategoriesVisibility,
  dict,
}: ProductMobileProps) {
  const pathname = usePathname();

  const { disableAnimation, setDisableAnimation } = useAnimationContext();
  const handleSecondAnimation = () => {
    if (!disableAnimation) {
      setDisableAnimation(true);
    }
  };

  return (
    <>
      <div className="flex flex-col h-full py-16 space-y-4 justify-center">
        {!disableAnimation ? (
          <div className="relative flex justify-center">
            <motion.div
              className="font-Bodoni absolute text-[4.5rem] top-32 -left-24 -left-20 uppercase text-secondary/5"
              initial={{ opacity: 0, x: 50, rotate: -90 }}
              animate={{ opacity: 1, x: 0, rotate: -90 }}
              exit={{ opacity: 0, x: 50, rotate: -90 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              {product.name}
            </motion.div>
            <motion.div
              initial={{ opacity: 0.5, y: -550 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
            >
              <Image
                src={product.imageUrl!}
                alt={product.name}
                width={800}
                height={2000}
                className="z-20 h-[22rem] w-[22rem] object-contain"
              />
            </motion.div>
          </div>
        ) : (
          <div className="relative">
            <figure>
              <Image
                src={product.imageUrl!}
                alt={product.name}
                width={800}
                height={2000}
                className="z-20 h-[22rem] w-[22rem] object-contain"
              />
            </figure>

            <motion.div
              className="font-Bodoni absolute text-[4.5rem] top-32 -left-24 sm:-left-20 uppercase text-secondary/5"
              initial={{ opacity: 0, x: 20, rotate: -90 }}
              animate={{ opacity: 1, x: 0, rotate: -90 }}
              transition={{
                type: "spring",
                damping: 12,
                stiffness: 100,
                ease: [0.36, 0.61, 0.04, 1],
                duration: 0.2,
                delay: 0.2,
              }}
            >
              {product.name}
            </motion.div>
          </div>
        )}
        {!disableAnimation ? (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="flex justify-center items-center flex-col gap-y-8"
          >
            <h1 className="text-center w-full text-lg mx-8 font-Noto uppercase">
              {product.name}
            </h1>
            <div
              className="flex flex-col space-y-3 cursor-pointer"
              onClick={toggleCategoriesVisibility}
            >
              <span className="h-[1.5px] bg-white px-24"></span>
              <h2 className="flex gap-1 items-center text-start text-sm w-full font-Noto uppercase">
                Catégories -
                <span className="capitalize text-sm">{product.category}</span>
                <BsCaretDownFill
                  size={15}
                  className={`ml-2 ${
                    showCategories ? `${styles.rotate}` : ""
                  } : ""}`}
                />
              </h2>
              <span className="h-[1.5px] bg-white px-24"></span>
            </div>
          </motion.div>
        ) : (
          <div className="flex justify-center items-center flex-col gap-y-8">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                type: "spring",
                damping: 12,
                stiffness: 100,
                ease: [0.36, 0.61, 0.04, 1],
                duration: 0.2,
                delay: 0.2,
              }}
              className="text-center w-full text-lg mx-8 font-Noto uppercase"
            >
              {product.name}
            </motion.h1>
            <div
              className="flex flex-col space-y-3 cursor-pointer"
              onClick={toggleCategoriesVisibility}
            >
              <span className="h-[1.5px] bg-secondary/70 px-24"></span>
              <h2 className="flex gap-1 items-center text-start text-sm w-full font-Noto uppercase">
                Catégories -
                <span className="capitalize text-sm">{product.category}</span>
                <BsCaretDownFill
                  size={15}
                  className={`ml-2 ${
                    showCategories ? `${styles.rotate}` : ""
                  } : ""}`}
                />
              </h2>
              <span className="h-[1.5px] bg-secondary/70 px-24"></span>
            </div>
          </div>
        )}
        {!disableAnimation ? (
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
            <div className="flex items-center justify-center space-x-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  type: "spring",
                  damping: 12,
                  stiffness: 100,
                  ease: [0.36, 0.61, 0.04, 1],
                  duration: 0.2,
                  delay: 0.2,
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
                incrementWishlist={addProductToWishlist}
              />
            </div>
            <div className="flex items-center justify-center gap-2">
              <AddToCartButton
                productId={product.id}
                addToCart={addProductToCart}
                dict={dict}
              />
            </div>
          </motion.div>
        ) : (
          <div className="flex flex-col mt-8 gap-y-8 mx-10">
            <div className="flex flex-col gap-4">
              <h2 className="text-3xl text-center">Description</h2>
              <motion.p
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  type: "spring",
                  damping: 12,
                  stiffness: 100,
                  ease: [0.36, 0.61, 0.04, 1],
                  duration: 0.2,
                  delay: 0.2,
                }}
                className="w-full"
              >
                {product.description}
              </motion.p>
            </div>
            <div className="flex items-center justify-center space-x-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  type: "spring",
                  damping: 12,
                  stiffness: 100,
                  ease: [0.36, 0.61, 0.04, 1],
                  duration: 0.2,
                  delay: 0.2,
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
                incrementWishlist={addProductToWishlist}
              />
            </div>
            <div className="flex items-center justify-center gap-2">
              <AddToCartButton
                productId={product.id}
                addToCart={addProductToCart}
                dict={dict}
              />
            </div>
          </div>
        )}
      </div>
      <AnimatePresence>
        {showColor ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="z-20 fixed top-0 h-screen w-screen flex justify-center items-center bg-primary/80"
          >
            <div
              onClick={toggleColorVisibility}
              className="absolute top-20 right-10 cursor-pointer"
            >
              <RxCross2 size={25} />
            </div>
            <ul className="flex flex-col gap-3 items-center justify-center uppercase">
              {/* /// */}
            </ul>
          </motion.div>
        ) : null}
      </AnimatePresence>
      <AnimatePresence>
        {showCategories ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="z-20 fixed top-0 h-screen w-screen flex justify-center items-center bg-primary/90"
          >
            <div
              onClick={toggleCategoriesVisibility}
              className="absolute top-20 right-10 cursor-pointer"
            >
              <RxCross2 size={25} />
            </div>
            <ul className="absolute w-[15rem] space-y-4">
              {products.map((product) => {
                if (product.category === productCategory) {
                  const productPath = `/products/${product.id}`;
                  return (
                    <motion.li
                      initial={{ opacity: 0.5, y: -50 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{
                        opacity: 0,
                        y: -50,
                      }}
                      transition={{ duration: 0.2 }}
                      key={product.id}
                    >
                      <Link
                        href={productPath}
                        className="w-full flex justify-center"
                        onClick={handleSecondAnimation}
                      >
                        {pathname === productPath ? (
                          <>
                            <div className="bg-secondary h-[1px] w-1/3"></div>
                            <div className="text-center w-full mx-4 -mt-3 font-Noto uppercase">
                              {product.name}
                            </div>
                            <div className="bg-secondary h-[1px] w-1/3"></div>
                          </>
                        ) : (
                          <>
                            <div className="text-center w-full mx-8 -mt-3 font-Noto uppercase">
                              {product.name}
                            </div>
                          </>
                        )}
                      </Link>
                    </motion.li>
                  );
                } else {
                  return null;
                }
              })}
            </ul>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
