import { prisma } from "@/lib/prisma";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";
import { getWishlist } from "@/lib/db/wishlist";
import { getDictionary } from "@/app/lang/dictionaries";
import { getCart } from "@/lib/db/cart";
import InterfaceProduct from "@/components/product/interface-product";

interface ProductProps {
  params: {
    id: string;
    lang: string;
  };
}

const getProduct = cache(async (id: string) => {
  const product = await prisma.product.findUnique({
    where: { id },
  });

  if (!product) notFound();
  return product;
});

export async function generateMetadata({
  params: { id },
}: ProductProps): Promise<Metadata> {
  const product = await getProduct(id);
  return {
    title: product.name + " - E-commerce",
    description: product.description,
    // openGraph: {
    //   images: [{ url: product.imageUrl }],
    // },
  };
}

export default async function Product({ params: { id, lang } }: ProductProps) {
  const products = await prisma.product.findMany({
    orderBy: {
      id: "desc",
    },
  });
  const dict = await getDictionary(lang);
  const product = await getProduct(id);
  const wishlist = await getWishlist();
  const cart = await getCart();

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
