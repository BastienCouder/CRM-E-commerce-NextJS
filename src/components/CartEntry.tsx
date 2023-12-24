"use client";
import formatPrice from "@/helpers/format";
import Image from "next/image";
import Link from "next/link";
import QuantitySelector from "./QuantityUpdate";
import {
  DeleteProduct,
  UpdateProductQuantity,
} from "@/app/[lang]/(pages)/cart/actions";
import Loading from "@/app/[lang]/loading";
import { CartItemsProps } from "@/lib/db/cart";
import { X } from "lucide-react";
import { Dictionary } from "@/app/[lang]/dictionaries/dictionaries";

interface CartEntryProps {
  cartItem: CartItemsProps;
  dict: Dictionary;
}

export default function CartEntry({ cartItem, dict }: CartEntryProps) {
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
    DeleteProduct(product.id, variant?.id);
  };

  return (
    <>
      <div className="justify-end items-center w-full lg:w-[180rem] flex flex-col lg:items-start">
        <h3 className="hidden lg:block text-xs mb-2 capitalize">
          {dict.cart.product}
        </h3>
        <div className="flex gap-8 items-center">
          {variant ? (
            <Image
              src={variant.imageUrl || ""}
              alt={product.name}
              width={200}
              height={200}
              className="rounded-lg w-[70px] h-[70px] object-contain border-white border-[1px]"
            />
          ) : (
            <Image
              src={product.imageUrl!}
              alt={product.name}
              width={200}
              height={200}
              className="rounded-lg w-[70px] h-[70px] object-contain border-white border-[1px]"
            />
          )}
          <Link href={"/products/" + product.id}>
            <p className="font-bold capitalize">{product.name}</p>
            {variant && <p className="text-sm capitalize">{variant.name}</p>}
          </Link>
        </div>
      </div>

      <div className="hidden lg:flex lg:h-[80px] justify-start items-center w-full flex flex-col lg:space-y-2 lg:items-start">
        <h3 className="text-xs mb-[1.2rem] capitalize">{dict.cart.price}</h3>
        <p className="font-bold">
          {variant?.price
            ? formatPrice(variant.price, dict.locale)
            : formatPrice(product.price, dict.locale)}
        </p>
      </div>

      <div className="justify-end items-center w-full flex flex-col lg:space-y-2 lg:items-start">
        <h3 className="hidden lg:block lg:text-xs capitalize">
          {quantity > 1 ? `${dict.cart.quantities}` : `${dict.cart.quantity}`}
        </h3>
        <QuantitySelector
          initialQuantity={quantity}
          onQuantityChange={handleQuantityChange}
          dict={dict}
        />
      </div>
      <div className="lg:h-[75px] justify-start items-center w-full flex flex-col lg:space-y-2 lg:items-start">
        <h3 className="hidden lg:block text-xs mb-[1.2rem] capitalize">
          {dict.cart.total_price}
        </h3>
        <p className="font-bold">
          {variant?.price
            ? formatPrice(variant.price * quantity, dict.locale)
            : formatPrice(product.price * quantity, dict.locale)}
        </p>
      </div>
      <div className="lg:h-[27px] justify-start items-center flex flex-col lg:space-y-6 lg:items-start">
        <div className="h-full"></div>
        <button
          aria-label={dict.actions.close}
          onClick={handleDelete}
          className=" px-2"
        >
          <X size={17} />
        </button>
      </div>
    </>
  );
}
