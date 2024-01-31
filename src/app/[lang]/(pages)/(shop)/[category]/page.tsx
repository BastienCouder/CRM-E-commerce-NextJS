import { prisma } from "@/lib/prisma";
import React, { cache } from "react";
import InterfaceShop from "@/components/shop/interface-shop";
import Loading from "@/app/[lang]/loading";
import { ColorEnum, ProductSchema } from "@/schemas/db-schema";
import { Metadata } from "next";
import { getDictionary } from "@/lang/dictionaries";
import { notFound } from "next/navigation";

export async function generateMetadata({
  params: { category },
}: StoreProps): Promise<Metadata> {
  const getCategory = await getCategories(category);
  return {
    title: getCategory.name + " - E-commerce",
    description: getCategory.name,
    // openGraph: {
    //   images: [{ url: product.imageUrl }],
    // },
  };
}
interface StoreProps {
  params: {
    category: string;
    lang: string;
  };
}

const getCategories = cache(async (category: string) => {
  const getCategory = await prisma.category.findUnique({
    where: { name: category },
  });

  if (!getCategory) notFound();
  return getCategory;
});

export default async function Store({
  params: { category, lang },
}: StoreProps) {
  const dict = await getDictionary(lang);
  const categoryData = await getCategories(category);

  const rawProducts = await prisma.product.findMany({
    where: { status: "available", categoryId: categoryData.id },
    include: { category: true },
  });

  const products = rawProducts.map((product) => ProductSchema.parse(product));
  console.log(products);

  if (!categoryData) {
    return <Loading />;
  }

  const colors = ColorEnum.options;

  return (
    <>
      <InterfaceShop products={products} colors={colors} dict={dict} />
    </>
  );
}
