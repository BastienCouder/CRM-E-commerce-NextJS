"use client";
import DangerButton from "@/app/dashboard/components/DangerButton";
import { Separator } from "@/components/ui/separator";

import SoftDeleteProduct from "../../../components/SoftDelete";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Restore from "@/app/dashboard/components/Restore";
import { useServerRestoreProduct } from "../action";
import { ProductProps } from "@/app/dashboard/lib/db/product";
import { Product } from "@prisma/client";
import { useServerDelete, useServerSoftDelete } from "@/app/dashboard/actions";
import SoftDelete from "../../../components/SoftDelete";

interface ProductSettingsFormProps {
  productId: string;
  product: ProductProps;
  UpdateProductStatus: (
    productId: string,
    newStatus: string
  ) => Promise<Product | null>;
}

export default async function ProductSettingsForm({
  productId,
  product,
  UpdateProductStatus,
}: ProductSettingsFormProps) {
  return (
    <>
      <Separator />
      <div className="space-y-2">
        <div>
          <h3 className="text-lg font-medium">Disponibilité</h3>
          <p className="text-sm text-muted-foreground">
            Mettez à jour le status de votre produit pour le rendre disponible
            ou non dans votre boutique.
          </p>
        </div>
        <Select
          onValueChange={async (newStatus) => {
            await UpdateProductStatus(product.id, newStatus);
          }}
        >
          <SelectTrigger
            className="w-[180px]"
            disabled={product.status === "delete"}
          >
            <SelectValue
              placeholder={
                product.status === "available" ? "Disponible" : "Indisponible"
              }
            />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="available">Disponible</SelectItem>
            <SelectItem value="unavailable">Indisponible</SelectItem>
          </SelectContent>
        </Select>
      </div>
      {product && product.deleteAt && (
        <>
          <Separator />
          <div className="space-y-2">
            <div>
              <h3 className="text-lg font-medium">Restorez le produit</h3>
              <p className="text-sm text-muted-foreground">
                Restorez votre produit dans votre boutique.
              </p>
            </div>
            <Restore
              productId={product.id}
              RestoreProduct={useServerRestoreProduct}
              type="settings"
            />
          </div>
        </>
      )}
      {product && !product.deleteAt && (
        <>
          <Separator />
          <div className="space-y-2">
            <div>
              <h3 className="text-lg font-medium">Supprimer le produit</h3>
              <p className="text-sm text-muted-foreground">
                Supprimez votre produit de votre boutique en le gardant dans
                votre base de donnée.
              </p>
            </div>
            <SoftDelete
              itemId={productId}
              SoftDelete={useServerSoftDelete}
              type="settings"
            />
          </div>
        </>
      )}
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
        <DangerButton itemId={productId} Delete={useServerDelete} />
      </div>
    </>
  );
}
