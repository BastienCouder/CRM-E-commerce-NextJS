import { prisma } from "@/lib/db/prisma";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";
import ProductInformationsForm from "@/components/dashboard/ProductInformationsForm";
import { CategoryEnum } from "@/lib/DbSchema";
import { updateProduct } from "./action";

interface ProductPageProps {
  params: {
    id: string;
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
}: ProductPageProps): Promise<Metadata> {
  const product = await getProduct(id);
  return {
    title: "Dashboard " + product.name + " - E-commerce",
    description: product.description,
  };
}

export default async function ProductPage({
  params: { id },
}: ProductPageProps) {
  const product = await getProduct(id);
  const categories = CategoryEnum.options;

  return (
    <>
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium">Informations</h3>
          <p className="text-sm text-muted-foreground">
            Mettez à jour les informations de votre produit.
          </p>
        </div>
        <ProductInformationsForm
          product={product}
          categories={categories}
          UpdateProduct={updateProduct}
        />
      </div>
    </>
  );
}
