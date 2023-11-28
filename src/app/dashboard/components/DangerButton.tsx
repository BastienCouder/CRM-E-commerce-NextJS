"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Product } from "@prisma/client";
import { useRouter } from "next/navigation";

interface DangerButtonProps {
  productId?: string;
  DeleteProduct?: (productId: string) => Promise<Product>;
}

export default function DangerButton({
  productId,
  DeleteProduct,
}: DangerButtonProps) {
  const router = useRouter();
  return (
    <div className="relative flex select-none items-center rounded-sm py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50">
      <AlertDialog>
        <AlertDialogTrigger className="flex items-center">
          <Button variant="destructive" size="xl">
            Supprimer définitivement
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Êtes-vous absolument sûr ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action ne pourra pas être annulée ultérieurement et sera
              irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            {productId && DeleteProduct ? (
              <AlertDialogAction
                onClick={async () => {
                  await DeleteProduct(productId);
                  router.push("/dashboard/products");
                }}
              >
                Continuer
              </AlertDialogAction>
            ) : null}
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
