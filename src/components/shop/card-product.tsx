"use client";
import Link from "next/link";
import PriceTag from "@/lib/helpers/PriceTag";
import Image from "next/image";
import { Color, Product } from "@/schemas/db-schema";
import { Dictionary } from "@/lang/dictionaries";
import { useDragControls, motion } from "framer-motion";

interface CardProductProps {
  product: Product;
  selectedColor: Color | null;
  dict: Dictionary;
}

export default function CardProduct({
  product,
  selectedColor,
  dict,
}: CardProductProps) {
  const controls = useDragControls();

  if (!selectedColor || product.color === selectedColor) {
    return (
      <motion.div
        drag="x"
        dragControls={controls}
        dragConstraints={{
          top: -50,
          left: -50,
          right: 50,
          bottom: 50,
        }}
      >
        <Link
          href={"/products/" + product.name}
          className="w-full flex flex-col justify-center items-center space-y-2"
        >
          <div>
            <figure>
              <Image
                src={product.imageUrl}
                alt={product.name}
                width={800}
                height={400}
                className="h-48 w-48 object-contain"
              />
            </figure>
          </div>
          <div className="w-full space-y-2 relative">
            <h2 className="text-xs text-center">{product.name}</h2>
            <div className="flex space-x-2 justify-center items-center">
              <div className="flex text-lg justify-center items-center">
                <PriceTag price={product.price} locale={dict.locale} />
              </div>
            </div>
          </div>
        </Link>
      </motion.div>
    );
  } else {
    return null;
  }
}
