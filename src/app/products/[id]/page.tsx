import PriceTag from "@/components/PriceTag";
import { prisma } from "@/lib/db/prisma";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";
import AddToCartButton from "./AddToCartButton";
import { incrementProductQuantity } from "./actions";

interface ProductPageProps {
  params: {
    id: string;
  };
}

const getProduct = cache(async (id: string) => {
  const product = await prisma.products.findUnique({
    where: { id },
    include: { category: true },
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
  const product = await getProduct(id);
  return (
    <div className="flex">
      <h2>{product.name}</h2>
      {product.category && <h2>{product.category.name}</h2>}
      <p>{product.description}</p>
      <PriceTag price={product.price} />
      <AddToCartButton
        productId={product.id}
        incrementProductQuantity={incrementProductQuantity}
      />
    </div>
  );
}
