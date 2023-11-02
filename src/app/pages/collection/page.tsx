import { prisma } from "@/lib/db/prisma";
import React from "react";
import CollectionPage from "./CollectionPage";

export default async function Home() {
  const products = await prisma.product.findMany({
    include: { category: true, color: true, variants: true },
  });

  const categories = await prisma.category.findMany();
  const colors = await prisma.color.findMany();

  return (
    <CollectionPage
      products={products}
      categories={categories}
      colors={colors}
    />
  );
}
