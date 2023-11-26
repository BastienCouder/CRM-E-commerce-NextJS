import DangerButton from "@/app/dashboard/components/DangerButton";
import { Separator } from "@/components/ui/separator";
import { useServerDeleteProduct } from "../../action";

interface ProductSettingsPageProps {
  params: {
    id: string;
  };
}

export default async function ProductSettingsPage({
  params: { id },
}: ProductSettingsPageProps) {
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
          <h3 className="text-lg font-medium">
            Supprimer de la base de donnée
          </h3>
          <DangerButton productId={id} DeleteProduct={useServerDeleteProduct} />
        </div>
        {/* <AccountForm /> */}
      </div>
    </>
  );
}
