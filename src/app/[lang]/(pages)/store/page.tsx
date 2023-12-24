import { prisma } from "@/lib/db/prisma";
import React from "react";
import Interface from "./InterfaceStore";
import Loading from "@/app/[lang]/loading";
import { CategoryEnum, ColorEnum, ProductSchema } from "@/lib/DbSchema";
import { Metadata } from "next";
import { getDictionary } from "@/app/[lang]/dictionaries/dictionaries";
import website from "@/lib/data/infosWebsite";

export async function generateMetadata({
  params: { lang },
}: StoreProps): Promise<Metadata> {
  const dict = await getDictionary(lang);

  return {
    title: `${dict.metadata.store_title} - ${website.name}`,
    description: `${dict.metadata.store_metadescritpion}`,
  };
}

interface StoreProps {
  params: {
    lang: string;
  };
}

export default async function Store({ params: { lang } }: StoreProps) {
  const dict = await getDictionary(lang);

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
      <Interface
        products={products}
        categories={categories}
        colors={colors}
        dict={dict}
      />
    </>
  );
}
