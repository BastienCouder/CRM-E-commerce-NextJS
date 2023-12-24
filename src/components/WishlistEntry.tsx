"use client";
import formatPrice from "@/helpers/format";
import Image from "next/image";
import Link from "next/link";
import Loading from "@/app/[lang]/loading";
import { useServerAddToCart } from "../app/[lang]/(pages)/wishlist/actions";
import AddToCartButton from "@/components/AddToCartButton";
import { WishlistItemsProps } from "@/lib/db/wishlist";
import { Dictionary } from "@/app/[lang]/dictionaries/dictionaries";

interface WishlistEntryProps {
  wishlistItem: WishlistItemsProps;
  AddToCart: (productId: string, variantId: string) => Promise<void>;
  dict: Dictionary;
}

export default function WishlistEntry({
  wishlistItem,
  dict,
}: WishlistEntryProps) {
  const { product, variant } = wishlistItem;
  if (!product || (variant && !variant)) {
    return <Loading />;
  }

  return (
    <>
      <div className="justify-end items-center w-full flex flex-col lg:items-start">
        <h3 className="hidden lg:block text-xs mb-2 capitalize">
          {dict.favories.product}
        </h3>
        <div className="flex gap-8 items-center">
          {variant ? (
            <Link href={"/products/" + product.id}>
              <Image
                src={variant.imageUrl || ""}
                alt={product.name}
                width={200}
                height={200}
                className="rounded-lg w-[70px] h-[70px] border-white border-[1px] object-contain"
              />
            </Link>
          ) : (
            <Link href={"/products/" + product.id}>
              <Image
                src={product.imageUrl!}
                alt={product.name}
                width={200}
                height={200}
                className="rounded-lg w-[70px] h-[70px] border-white border-[1px] object-contain"
              />
            </Link>
          )}
          <Link href={"/products/" + product.id}>
            <p className="font-bold capitalize">{product.name}</p>
            {variant && <p className="text-sm capitalize">{variant.name}</p>}
          </Link>
        </div>
      </div>

      <div className="lg:h-[85px] justify-start items-center w-full flex flex-col lg:space-y-2 lg:items-start">
        <h3 className="hidden lg:flex text-xs mb-[1.5rem] capitalize">
          {dict.favories.price}
        </h3>
        <p className="font-bold">
          {variant?.price
            ? formatPrice(variant.price, dict.locale)
            : formatPrice(product.price, dict.locale)}
        </p>
      </div>
      <div className="w-[80rem] lg:h-[85px] flex justify-center pt-[1.2rem] items-center">
        <AddToCartButton
          productId={product.id}
          addToCart={useServerAddToCart}
          variantId={variant?.id || ""}
          dict={dict}
        />
      </div>
    </>
  );
}
