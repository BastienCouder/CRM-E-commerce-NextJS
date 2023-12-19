import { cache } from "react";
import { notFound } from "next/navigation";
import ProductSettingsForm from "./ProductSettingsForm";
import { useServerUpdateProductStatus } from "../action";

const getProduct = cache(async (id: string) => {
  const product = await prisma.product.findUnique({
    where: { id },
    include: { category: true, variants: true },
  });

  if (!product) notFound();
  return product;
});

interface ProductSettingsPageProps {
  params: {
    id: string;
  };
}

export default async function ProductSettingsPage({
  params: { id },
}: ProductSettingsPageProps) {
  const product = await getProduct(id);

  return (
    <>
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium">Options</h3>
          <p className="text-sm text-muted-foreground">
            Mettez à jour les paramètres de votre produit.
          </p>
        </div>
        <ProductSettingsForm
          product={product}
          productId={id}
          UpdateProductStatus={useServerUpdateProductStatus}
        />
      </div>
    </>
  );
}
