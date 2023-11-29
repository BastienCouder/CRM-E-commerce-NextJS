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
import { Order } from "../lib/zod";

interface SoftDeleteProps {
  itemId: string;
  SoftDelete: (itemId: string) => Promise<Product | Order>;
  type: string;
}

export default function SoftDelete({
  itemId,
  SoftDelete,
  type,
}: SoftDeleteProps) {
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
                await SoftDelete(itemId);
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
