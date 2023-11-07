import { prisma } from "@/lib/db/prisma";
import React from "react";
import Collection from "./Collection";
import Loading from "@/app/loading";

export default async function Home() {
  const products = await prisma.product.findMany({
    include: { category: true, color: true, variants: true },
  });

  const categories = await prisma.category.findMany();
  const colors = await prisma.color.findMany();

  if (products || categories || colors) {
    <Loading />;
  }

  return (
    <>
      <Collection products={products} categories={categories} colors={colors} />
    </>
  );
}
