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
import { DropdownMenuShortcut } from "@/components/ui/dropdown-menu";
import { Product } from "@prisma/client";
import { Delete } from "lucide-react";

interface SoftDeleteProductProps {
  productId: string;
  SoftDeleteProduct: (productId: string) => Promise<Product>;
}

export default function SoftDeleteProduct({
  productId,
  SoftDeleteProduct,
}: SoftDeleteProductProps) {
  return (
    <div className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50">
      <AlertDialog>
        <AlertDialogTrigger className="flex w-full items-center">
          Delete
          <DropdownMenuShortcut>
            <Delete size={15} />
          </DropdownMenuShortcut>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Êtes-vous absolument sûr ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action pourra être annulée ultérieurement.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={async () => {
                await SoftDeleteProduct(productId);
              }}
            >
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
