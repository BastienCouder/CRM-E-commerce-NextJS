import DangerButton from "@/app/dashboard/components/DangerButton";
import { Separator } from "@/components/ui/separator";
import {
  useServerDeleteProduct,
  useServerSoftDeleteProduct,
} from "../../action";
import SoftDeleteProduct from "../../../components/SoftDelete";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cache } from "react";
import { notFound } from "next/navigation";

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
        <Separator />
        <div className="space-y-2">
          <div>
            <h3 className="text-lg font-medium">Disponibilité</h3>
            <p className="text-sm text-muted-foreground">
              Mettez à jour le status de votre produit pour le rendre disponible
              ou non dans votre boutique.
            </p>
          </div>
          <Select>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder={product.status} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="available">Disponible</SelectItem>
              <SelectItem value="unavailable">Indisponible</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Separator />
        <div className="space-y-2">
          <div>
            <h3 className="text-lg font-medium">Supprimer le produit</h3>
            <p className="text-sm text-muted-foreground">
              Supprimez votre produit de votre boutique en le gardant dans votre
              base de donnée.
            </p>
          </div>
          <SoftDeleteProduct
            productId={id}
            SoftDeleteProduct={useServerSoftDeleteProduct}
            type="settings"
          />
        </div>
        <Separator />
        <div className="space-y-2">
          <div>
            <h3 className="text-lg font-medium">
              Supprimer le produit de la base de donnée
            </h3>
            <p className="text-sm text-muted-foreground">
              Supprimez votre produit de votre boutique et de votre base de
              donnée. Attention cette action est irréversible.
            </p>
          </div>
          <DangerButton productId={id} DeleteProduct={useServerDeleteProduct} />
        </div>
        {/* <AccountForm /> */}
      </div>
    </>
  );
}
