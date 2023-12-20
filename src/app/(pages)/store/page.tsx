import { prisma } from "@/lib/db/prisma";
import React from "react";
import Collection from "./Collection";
import Loading from "@/app/loading";
import { CategoryEnum, ColorEnum, ProductSchema } from "@/lib/DbSchema";

export default async function Store() {
  const rawProducts = await prisma.product.findMany({
    where: { status: "available" },
    include: { variants: true },
  });

  const products = rawProducts.map((product) => ProductSchema.parse(product));

  if (products) {
    <Loading />;
  }

  const categories = CategoryEnum.options;
  const colors = ColorEnum.options;
  return (
    <>
      <Collection products={products} categories={categories} colors={colors} />
    </>
  );
}
