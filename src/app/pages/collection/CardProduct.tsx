"use client";
import Link from "next/link";
import PriceTag from "@/components/PriceTag";
import Image from "next/image";

import { Product, Category } from "@prisma/client";
import { Badge } from "@/components/ui/badge";
interface CardProductProps {
  product: Product & {
    category: Category | null;
  };
  selectedCategory: Category | null;
}

export default function CardProduct({
  product,
  selectedCategory,
}: CardProductProps) {
  const isNew =
    Date.now() - new Date(product.createdAt).getTime() <
    1000 * 60 * 60 * 24 * 7;
  if (!selectedCategory || product.category?.id === selectedCategory.id) {
    return (
      <div className="flex justify-center max-w-[300px] max-h-[350px] p-4">
        <Link
          href={"/products/" + product.id}
          className="w-full flex flex-col justify-center items-center space-y-4"
        >
          <figure>
            <Image
              src={product.imageUrl}
              alt={product.name}
              width={800}
              height={400}
              className="h-52 object-contain"
            />
          </figure>
          <div className="w-full space-y-2 relative">
            {isNew && <Badge className="absolute left-6">New</Badge>}

            <h2 className="text-2xl text-center">{product.name}</h2>

            <div className="text-center">
              <PriceTag price={product.price} />
            </div>
          </div>
        </Link>
      </div>
    );
  } else {
    // Return null if the product does not match the selected category
    return null;
  }
}
