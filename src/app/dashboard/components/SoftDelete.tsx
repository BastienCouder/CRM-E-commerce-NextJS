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
import { DropdownMenuShortcut } from "@/components/ui/dropdown-menu";
import { Product } from "@prisma/client";
import { Delete } from "lucide-react";

interface SoftDeleteProductProps {
  productId: string;
  SoftDeleteProduct: (productId: string) => Promise<Product>;
  type: string;
}

export default function SoftDeleteProduct({
  productId,
  SoftDeleteProduct,
  type,
}: SoftDeleteProductProps) {
  return (
    <div className="relative flex cursor-default select-none items-center rounded-sm py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50">
      <AlertDialog>
        {type === "actions" && (
          <AlertDialogTrigger className="flex w-full items-center px-2">
            Supprimer
            <DropdownMenuShortcut>
              <Delete size={15} />
            </DropdownMenuShortcut>
          </AlertDialogTrigger>
        )}
        {type === "settings" && (
          <AlertDialogTrigger className="flex items-center">
            <Button variant="delete" size="lg">
              Supprimer
            </Button>
          </AlertDialogTrigger>
        )}
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Êtes-vous absolument sûr ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action pourra être annulée ultérieurement.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={async () => {
                await SoftDeleteProduct(productId);
              }}
            >
              Continuer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
