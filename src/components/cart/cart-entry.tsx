"use client";
import formatPrice from "../../lib/helpers/format";
import Image from "next/image";
import Link from "next/link";
import QuantitySelector from "./quantity-update";

import Loading from "@/app/[lang]/loading";
import { X } from "lucide-react";
import { Dictionary } from "@/lang/dictionaries";
import routes from "@/lib/data/routes.json";
import { CartItem } from "@/schemas/db-schema";
import { updateCartItemQuantity } from "@/app/actions/pages/update-cart-quantity";
import { deleteProductFromCart } from "@/app/actions/pages/delete-product-from-cart";

interface CartEntryProps {
  cartItem: CartItem;
  dict: Dictionary;
}

export default function CartEntry({ cartItem, dict }: CartEntryProps) {
  const { product, quantity } = cartItem;

  if (!product) {
    return <Loading />;
  }

  const handleQuantityChange = (quantity: number) => {
    updateCartItemQuantity(product.id, quantity);
  };

  const handleDelete = () => {
    deleteProductFromCart(product.id);
  };

  return (
    <>
      <div className="justify-end items-center w-full lg:w-[180rem] flex flex-col lg:items-start">
        <h3 className="hidden lg:block text-xs mb-2 capitalize">
          {dict.cart.product}
        </h3>
        <div className="flex gap-8 items-center">
          <Image
            src={product.imageUrl}
            alt={product.name}
            width={200}
            height={200}
            className="rounded-lg w-[70px] h-[70px] object-contain border-white border-[1px]"
          />

          <Link href={`${routes.products}/` + product.id}>
            <p className="font-bold capitalize">{product.name}</p>
          </Link>
        </div>
      </div>

      <div className="hidden lg:flex lg:h-[80px] justify-start items-center w-full flex flex-col lg:space-y-2 lg:items-start">
        <h3 className="text-xs mb-[1.2rem] capitalize">{dict.cart.price}</h3>
        <p className="font-bold">{formatPrice(product.price, dict.locale)}</p>
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
          {formatPrice(product.price * quantity, dict.locale)}
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
