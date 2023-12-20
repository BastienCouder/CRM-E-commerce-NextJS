"use client";
import Image from "next/image";
import formatPrice, { formatDescription } from "@/helpers/format";
import { CartItemsProps } from "@/lib/db/cart";

interface CartItemProps {
  cartItem: CartItemsProps;
}

export default function CartItem({ cartItem }: CartItemProps) {
  const description = `${cartItem.product.description}`;
  const formattedDescription = formatDescription(description);

  return (
    <li className="md:w-1/4 space-y-2">
      <div className="flex w-full">
        <Image
          src={
            cartItem.variant
              ? cartItem.variant.imageUrl || ""
              : cartItem.product.imageUrl
          }
          alt={cartItem.product.name}
          width={400}
          height={400}
          className="rounded-lg w-[70px] h-[70px] object-contain"
        />
      </div>
      <div className="flex flex-col space-y-1">
        <p className="font-bold flex Item-center gap-2">
          {cartItem.product.name}
          {cartItem.variant && (
            <>
              <span>-</span>
              <span className="text-sm">{cartItem.variant.name}</span>
            </>
          )}
        </p>
        <p className="w-full text-sm">{formattedDescription}</p>
        <p className="uppercase">
          {formatPrice(
            cartItem.variant?.price
              ? cartItem.variant?.price
              : cartItem.product.price,
            "EUR"
          )}
        </p>
        <p className="capitalize flex gap-2">
          {cartItem.quantity > 1 ? `quantités` : `quantité`}
          <span>{cartItem.quantity}</span>
        </p>
      </div>
    </li>
  );
}
