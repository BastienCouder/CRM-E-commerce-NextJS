import { prisma } from "@/lib/prisma";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";
import { getWishlist } from "@/lib/db/wishlist";
import { getDictionary } from "@/lang/dictionaries";
import { getCart } from "@/lib/db/cart";
import InterfaceProduct from "@/components/product/interface-product";
import { replaceEncodedSpaces } from "@/lib/utils";

interface ProductProps {
  params: {
    name: string;
    lang: string;
  };
}

const getProduct = cache(async (name: string) => {
  name = replaceEncodedSpaces(name);
  const product = await prisma.product.findUnique({
    where: { name },
    include: { category: true },
  });

  if (!product) notFound();
  return product;
});

export async function generateMetadata({
  params: { name },
}: ProductProps): Promise<Metadata> {
  const product = await getProduct(name);
  return {
    title: product.name + " - E-commerce",
    description: product.description,
    // openGraph: {
    //   images: [{ url: product.imageUrl }],
    // },
  };
}

export default async function Product({
  params: { name, lang },
}: ProductProps) {
  const products = await prisma.product.findMany({
    orderBy: {
      id: "desc",
    },
  });
  const dict = await getDictionary(lang);
  const product = await getProduct(name);
  const wishlist = await getWishlist();
  const cart = await getCart();

  if (!products) {
    return notFound();
  }

  return (
    <InterfaceProduct
      products={products}
      product={product}
      wishlistItems={wishlist?.wishlistItems}
      cartItems={cart?.cartItems}
      dict={dict}
    />
  );
}
