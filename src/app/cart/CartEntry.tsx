"use client";

import { CartItemWithProduct } from "@/lib/db/cart";
import formatPrice from "@/lib/format";
import Image from "next/image";
import Link from "next/link";

import QuantitySelector from "./QuantityUpdate";
import { DeleteProduct, UpdateProductQuantity } from "./actions";
import { RxCross2 } from "react-icons/rx";
import { useState } from "react";
import Loading from "../loading";

interface CartEntryProps {
  cartItem: CartItemWithProduct;
}

export default function CartEntry({ cartItem }: CartEntryProps) {
  const { product, quantity, variant } = cartItem;

  if (!product || (variant && !variant)) {
    return <Loading />;
  }

  const handleQuantityChange = (quantity: number) => {
    if (variant) {
      UpdateProductQuantity(product.id, quantity, variant.id);
    } else {
      UpdateProductQuantity(product.id, quantity, null);
    }
  };

  const handleDelete = () => {
    DeleteProduct(product.id);
  };

  return (
    <>
      <div className="justify-end items-center w-full lg:w-[180rem] flex flex-col lg:items-start">
        <h3 className="hidden lg:block text-xs mb-2">Produit</h3>
        <div className="flex gap-8 items-center">
          {variant ? (
            <Image
              src={variant.imageUrl || ""}
              alt={product.name}
              width={200}
              height={200}
              className="rounded-lg w-[70px] h-[70px] border-white border-[1px]"
            />
          ) : (
            <Image
              src={product.imageUrl}
              alt={product.name}
              width={200}
              height={200}
              className="rounded-lg w-[70px] h-[70px] border-white border-[1px]"
            />
          )}
          <Link href={"/products/" + product.id}>
            <p className="font-bold capitalize">{product.name}</p>
            {variant && <p className="text-sm capitalize">{variant.color}</p>}
          </Link>
        </div>
      </div>

      <div className="hidden lg:flex lg:h-[80px] justify-start items-center w-full flex flex-col lg:space-y-2 lg:items-start">
        <h3 className="text-xs mb-[1.2rem]">Prix</h3>
        <p className="font-bold">
          {variant?.price
            ? formatPrice(variant.price, "EUR")
            : formatPrice(product.price, "EUR")}
        </p>
      </div>

      <div className="justify-end items-center w-full flex flex-col lg:space-y-2 lg:items-start">
        <h3 className="hidden lg:block lg:text-xs">Quantité</h3>
        <QuantitySelector
          initialQuantity={quantity}
          onQuantityChange={handleQuantityChange}
        />
      </div>
      <div className="lg:h-[75px] justify-start items-center w-full flex flex-col lg:space-y-2 lg:items-start">
        <h3 className="hidden lg:block text-xs mb-[1.2rem]">Prix Total</h3>
        <p className="font-bold">
          {variant?.price
            ? formatPrice(variant.price * quantity, "EUR")
            : formatPrice(product.price * quantity, "EUR")}
        </p>
      </div>
      <div className="lg:h-[27px] justify-start items-center flex flex-col lg:space-y-6 lg:items-start">
        <div className="h-full "></div>
        <button onClick={handleDelete} className=" px-2">
          <RxCross2 />
        </button>
      </div>
    </>
  );
}
