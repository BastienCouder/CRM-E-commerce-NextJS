"use client";
import Image from "next/image";
import formatPrice, { formatDescription } from "../../lib/helpers/format";
import { CartItem } from "@/schemas/db-schema";
import { Dictionary } from "@/lang/dictionaries";

interface CartItemsDetailsProps {
  cartItem: CartItem;
  dict: Dictionary;
}

export default function CartItemsDetails({
  cartItem,
  dict,
}: CartItemsDetailsProps) {
  const description = `${cartItem.product.description}`;
  const formattedDescription = formatDescription(description);

  return (
    <li className="space-y-2">
      <div className="flex w-full">
        <Image
          src={cartItem.product.imageUrl}
          alt={cartItem.product.name}
          width={400}
          height={400}
          className="rounded-lg w-[70px] h-[70px] object-contain"
        />
      </div>
      <div className="flex flex-col space-y-1">
        <p className="font-bold flex Item-center gap-2">
          {cartItem.product.name}
        </p>
        <p className="w-full text-sm">{formattedDescription}</p>
        <p className="uppercase">
          {formatPrice(cartItem.product.price, dict.locale)}
        </p>
        <p className="capitalize flex gap-2">
          {cartItem.quantity > 1
            ? `${dict.payment.quantities}`
            : `${dict.payment.quantity}`}
          <span>{cartItem.quantity}</span>
        </p>
      </div>
    </li>
  );
}
