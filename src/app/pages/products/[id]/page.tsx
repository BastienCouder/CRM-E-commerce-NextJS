import { prisma } from "@/lib/db/prisma";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";
import { useServerAddToCart, useServerAddWishlist } from "./actions";
import Product from "./Product";
import { getLike } from "@/lib/db/like";

interface ProductPageProps {
  params: {
    id: string;
  };
}

const getProduct = cache(async (id: string) => {
  const product = await prisma.product.findUnique({
    where: { id },
    include: { category: true, variants: true },
  });

  if (!product) notFound();
  return product;
});

export async function generateMetadata({
  params: { id },
}: ProductPageProps): Promise<Metadata> {
  const product = await getProduct(id);
  return {
    title: product.name + " - E-commerce",
    description: product.description,
    // openGraph: {
    //   images: [{ url: product.imageUrl }],
    // },
  };
}

export default async function ProductPage({
  params: { id },
}: ProductPageProps) {
  const products = await prisma.product.findMany({
    orderBy: {
      id: "desc",
    },
    include: { category: true, likedByUsers: true },
  });

  const product = await getProduct(id);
  const like = await getLike(product.id);

  return <Product products={products} product={product} like={like} />;
}
