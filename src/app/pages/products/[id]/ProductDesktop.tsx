import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { BsCaretDownFill } from "react-icons/bs";
import AddToCartButton from "./components/AddToCartButton";
import PriceTag from "@/components/PriceTag";
import { Category, Product, ProductVariant } from "@prisma/client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import AddToWishlist from "./components/AddToWishlist";
import { ShoppingLike } from "@/lib/db/like";
import { useServerAddToCart, useServerAddWishlist } from "./actions";

interface ProductDesktopProps {
  like: ShoppingLike | null;
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
  selectedColor: string | null;
  selectedVariant: ProductVariant | undefined;
  product: ExtendedProduct;
  toggleColorVisibility: () => Promise<void>;
  handleColorChange: (color: string) => void;
}

interface ExtendedProduct extends Product {
  variants: ProductVariant[];
  category: Category | null;
}
export default function ProductDesktop({
  like,
  products,
  showColor,
  selectedColor,
  selectedVariant,
  product,
  toggleColorVisibility,
  handleColorChange,
}: ProductDesktopProps) {
  const pathname = usePathname();

  return (
    <>
      <div className="h-screen w-full flex">
        <div className="h-full w-1/5 pt-32 pl-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute w-[15rem] space-y-4"
          >
            {products.map((product) => {
              if (product.category?.name === product.category?.name) {
                const productPath = `/products/${product.id}`;
                return (
                  <Link
                    href={productPath}
                    key={product.id}
                    className="w-full flex justify-center pl-16"
                  >
                    {pathname === productPath ? (
                      <>
                        <div className="bg-white h-[1px] w-1/3"></div>
                        <div className="text-center w-full mx-4 -mt-3 font-Noto uppercase">
                          {product.name}
                        </div>
                        <div className="bg-white h-[1px] w-1/3"></div>
                      </>
                    ) : (
                      <>
                        <div className="text-center w-full mx-8 -mt-3 font-Noto uppercase">
                          {product.name}
                        </div>
                      </>
                    )}
                  </Link>
                );
              } else {
                return null;
              }
            })}
          </motion.div>
        </div>

        <div className="flex w-4/5">
          <div className="h-full w-1/3 flex justify-end pr-6 items-center">
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
          <div className="h-full w-1/3">
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
                className="flex justify-center items-center flex-col gap-y-4"
              >
                <div className="w-full flex justify-center pb-8 px-16">
                  <div className="bg-white h-[1px] w-1/2"></div>
                  <h1 className="text-center w-full mx-4 -mt-3 font-Noto uppercase">
                    {product.name}
                  </h1>
                  <div className="bg-white h-[1px] w-1/2"></div>
                </div>
                <h2 className="text-center font-bold w-full mx-4 -mt-3 font-Noto uppercase">
                  {product.category?.name}
                </h2>
              </motion.div>
            </div>
          </div>
          <div className="h-full w-1/3 flex justify-start pl-6 items-center">
            <div className="flex flex-col items-start gap-4">
              <motion.div
                initial={{ opacity: 0, x: 30, y: 0 }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                exit={{ opacity: 0, x: 30, y: 0 }}
                transition={{ delay: 0.3, duration: 0.4 }}
              >
                {product.variants.length > 0 ? (
                  <h2
                    onClick={toggleColorVisibility}
                    className="cursor-pointer text-3xl justify-center items-center relative flex row-reverse"
                  >
                    Couleur <BsCaretDownFill size={15} className="ml-2" />
                    <span className="w-[8rem] h-[1px] bg-white absolute bottom-4 -left-[8.8rem]"></span>
                  </h2>
                ) : null}
                <p className="uppercase text-xs">{selectedVariant?.color}</p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 50 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="flex flex-col mt-8 gap-y-8"
              >
                <div className="flex items-center space-x-4">
                  <PriceTag
                    price={
                      selectedVariant?.price
                        ? selectedVariant?.price
                        : product.price
                    }
                    className="text-xl text-start font-bold"
                  />
                  <AddToWishlist
                    productId={product.id}
                    variantId={selectedVariant?.id}
                    incrementWishlist={useServerAddWishlist}
                    like={like}
                  />
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center justify-center gap-2">
                    <AddToCartButton
                      productId={product.id}
                      addToCart={useServerAddToCart}
                      variantId={selectedVariant?.id || ""}
                    />
                  </div>
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
  );
}
