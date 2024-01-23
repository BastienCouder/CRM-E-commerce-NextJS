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
import { Delete, X } from "lucide-react";

interface SoftDeleteProps {
  itemId: string | string[];
  SoftDelete: (itemId: string) => Promise<any>;
  type: string;
}

export default function SoftDelete({
  itemId,
  SoftDelete,
  type,
}: SoftDeleteProps) {
  const handleDelete = async () => {
    if (Array.isArray(itemId)) {
      await Promise.all(itemId.map((id) => SoftDelete(id)));
    } else {
      await SoftDelete(itemId);
    }
  };

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
            <Button variant="destructive" size="lg">
              Supprimer
            </Button>
          </AlertDialogTrigger>
        )}
        {type === "toolbar" && (
          <AlertDialogTrigger>
            <Button
              variant="destructive"
              size="lg"
              className="h-8 px-2 lg:px-3"
            >
              Supprimer
              <X className="ml-2 h-4 w-4" />
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
            <AlertDialogAction onClick={handleDelete}>
              Continuer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
