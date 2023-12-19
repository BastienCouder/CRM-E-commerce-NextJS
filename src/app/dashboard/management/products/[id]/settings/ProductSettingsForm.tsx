"use client";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Restore from "@/components/dashboard/Restore";
import { ProductProps } from "@/lib/db/product";
import { Product } from "@prisma/client";
import {
  useServerDelete,
  useServerRestore,
  useServerSoftDelete,
} from "@/app/dashboard/actions";
import SoftDelete from "../../../components/SoftDelete";
import DangerDelete from "@/components/dashboard/DangerDelete";

interface ProductSettingsFormProps {
  productId: string;
  product: ProductProps;
  UpdateProductStatus: (
    productId: string,
    newStatus: string
  ) => Promise<Product | null>;
}

export default function ProductSettingsForm({
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
              itemId={product.id}
              RestoreItem={useServerRestore}
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
        <DangerDelete itemId={productId} Delete={useServerDelete} />
      </div>
    </>
  );
}
