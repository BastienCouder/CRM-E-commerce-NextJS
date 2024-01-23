import { cache } from "react";
import { notFound } from "next/navigation";
import SettingsForm from "@/components/dashboard/settings-form";
import { updateStatusItem } from "../../../action/update-status";

const getProduct = cache(async (id: string) => {
  const product = await prisma.product.findUnique({
    where: { id },
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
        <SettingsForm
          item={product}
          itemId={id}
          updateStatus={updateStatusItem}
          type="product"
        />
      </div>
    </>
  );
}
