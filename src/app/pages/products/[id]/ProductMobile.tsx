import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { AiOutlinePlus } from "react-icons/ai";
import AddToCartButton from "../../../../components/AddToCartButton";
import PriceTag from "@/components/PriceTag";
import { Category, Product, ProductVariant } from "@prisma/client";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { RxCross2 } from "react-icons/rx";
import AddToWishlist from "../../../../components/AddToWishlist";
import { useServerAddToCart, useServerAddWishlist } from "./actions";
import { BsCaretDownFill } from "react-icons/bs";
import { useAnimationContext } from "@/context/AnimationContext";
import styles from "@/styles/Utils.module.css";
import { WishlistItemsProps } from "@/lib/db/wishlist";

interface ProductMobileProps {
  wishlistItems: WishlistItemsProps[] | undefined;
  productCategory: string | null | undefined;

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
  showColor: boolean;
  showCategories: boolean;
  selectedColor: string | null;
  selectedVariant: ProductVariant | undefined;
  product: ExtendedProduct;
  toggleColorVisibility: () => Promise<void>;
  toggleCategoriesVisibility: () => Promise<void>;
  handleColorChange: (color: string) => void;
}

interface ExtendedProduct extends Product {
  variants: ProductVariant[];
  category: Category | null;
}

export default function ProductMobile({
  wishlistItems,
  products,
  showColor,
  productCategory,
  showCategories,
  selectedColor,
  selectedVariant,
  product,
  toggleColorVisibility,
  toggleCategoriesVisibility,
  handleColorChange,
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
              key={selectedColor}
              initial={{ opacity: 0.5, y: -550 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
            >
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
                  className="z-20 h-[22rem] w-[22rem] object-contain"
                />
              ) : (
                <Image
                  src={product.imageUrl}
                  alt={product.name}
                  width={800}
                  height={2000}
                  className="z-20 h-[22rem] w-[22rem] object-contain"
                />
              )}
            </motion.div>

            <motion.div
              className="font-Bodoni absolute text-[4.5rem] top-32 -left-24 sm:-left-20 uppercase text-secondary/5"
              initial={{ opacity: 0, x: 50, rotate: -90 }}
              animate={{ opacity: 1, x: 0, rotate: -90 }}
              exit={{ opacity: 0, x: 50, rotate: -90 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              {product.name}
            </motion.div>
            {product.variants.length > 0 ? (
              <motion.div
                initial={{ opacity: 0, x: 30, y: 0 }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                exit={{ opacity: 0, x: 30, y: 0 }}
                transition={{ delay: 0.3, duration: 0.4 }}
                className="absolute top-10 right-8"
              >
                <div
                  onClick={toggleColorVisibility}
                  className="cursor-pointer h-12 w-12 rounded-full bg-secondary/5 flex justify-center items-center"
                >
                  <AiOutlinePlus size={20} />
                </div>
                <p className="absolute top-20 -right-1 -rotate-90 text-secondary/50">
                  Couleur
                </p>
              </motion.div>
            ) : null}
          </div>
        ) : (
          <div className="relative">
            <figure>
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
                  className="z-20 h-[22rem] w-[22rem] object-contain"
                />
              ) : (
                <Image
                  src={product.imageUrl}
                  alt={product.name}
                  width={800}
                  height={2000}
                  className="z-20 h-[22rem] w-[22rem] object-contain"
                />
              )}
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
            {product.variants.length > 0 ? (
              <div className="absolute top-10 right-8">
                <div
                  onClick={toggleColorVisibility}
                  className="cursor-pointer h-12 w-12 rounded-full bg-secondary/5 flex justify-center items-center"
                >
                  <AiOutlinePlus size={20} />
                </div>
                <p className="absolute top-20 -right-1 -rotate-90 text-secondary/50">
                  Couleur
                </p>
              </div>
            ) : null}
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
              <span className="h-[1.5px] bg-secondary/70 px-24"></span>
              <h2 className="flex gap-1 items-center text-start text-sm w-full font-Noto uppercase">
                Catégories -
                <span className="capitalize text-sm">
                  {product.category?.name}
                </span>
                <BsCaretDownFill
                  size={15}
                  className={`ml-2 ${
                    showCategories ? `${styles.rotate}` : ""
                  } : ""}`}
                />
              </h2>
              <span className="h-[1.5px] bg-secondary/70 px-24"></span>
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
                <span className="capitalize text-sm">
                  {product.category?.name}
                </span>
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
                key={selectedColor}
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
                  price={
                    selectedVariant?.price
                      ? selectedVariant?.price
                      : product.price
                  }
                  className="text-xl text-start font-bold"
                />
              </motion.div>
              <AddToWishlist
                handleColorChange={handleColorChange}
                wishlistItems={wishlistItems}
                productId={product.id}
                variantId={selectedVariant?.id}
                incrementWishlist={useServerAddWishlist}
              />
            </div>
            <div className="flex items-center justify-center gap-2">
              <AddToCartButton
                productId={product.id}
                addToCart={useServerAddToCart}
                variantId={selectedVariant?.id || ""}
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
                key={selectedColor}
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
                  price={
                    selectedVariant?.price
                      ? selectedVariant?.price
                      : product.price
                  }
                  className="text-xl text-start font-bold"
                />
              </motion.div>
              <AddToWishlist
                handleColorChange={handleColorChange}
                wishlistItems={wishlistItems}
                productId={product.id}
                variantId={selectedVariant?.id}
                incrementWishlist={useServerAddWishlist}
              />
            </div>
            <div className="flex items-center justify-center gap-2">
              <AddToCartButton
                productId={product.id}
                addToCart={useServerAddToCart}
                variantId={selectedVariant?.id || ""}
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
                  {variant.name}
                </motion.li>
              ))}
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
                if (product.category?.name === productCategory) {
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
