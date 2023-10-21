"use client";
import { AnimatePresence, motion } from "framer-motion";
import { useState, useCallback } from "react";
import Image from "next/image";
import PriceTag from "@/components/PriceTag";
import AddToCartButton from "./AddToCartButton";
import { AiOutlinePlus } from "react-icons/ai";

interface ProductProps {
  product: any;
  incrementProductQuantity: (productId: string) => Promise<void>;
}
export default function Product({
  product,
  incrementProductQuantity,
}: ProductProps) {
  const [showColor, setShowColor] = useState(false);

  const toggleColorVisibility = useCallback(async () => {
    setShowColor(!showColor);
  }, [showColor]);

  return (
    <>
      <div className="flex h-full py-16">
        <div className="flex flex-col">
          <div className="relative">
            <motion.div
              initial={{ opacity: 0, y: 150 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 150 }}
              transition={{ duration: 0.6 }}
            >
              <Image
                src={"/images/montre1.png"}
                alt={product.name}
                width={500}
                height={1000}
                className="z-50 h-[28rem] object-contain"
              />
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
              className="z-50 absolute top-10 right-10 "
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
              price={product.price}
              className="text-2xl text-center font-bold"
            />
            <AddToCartButton
              productId={product.id}
              incrementProductQuantity={incrementProductQuantity}
            />
          </motion.div>
        </div>
      </div>
      {showColor ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed top-0 h-screen w-screen flex justify-center items-center bg-zinc-900/80"
        >
          <ul className="flex flex-col gap-3 items-center justify-center uppercase">
            <li className="cursor-pointer">or</li>
            <li className="cursor-pointer">rose</li>
            <li className="cursor-pointer">argent</li>
          </ul>
        </motion.div>
      ) : null}
    </>
  );
}
