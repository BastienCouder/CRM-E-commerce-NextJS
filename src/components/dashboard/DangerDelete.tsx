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
import { Order, Product } from "@prisma/client";
import { useRouter } from "next/navigation";

interface DangerDeleteProps {
  itemId: string;
  Delete: (itemId: string) => Promise<Product | Order>;
}

export default function DangerDelete({ itemId, Delete }: DangerDeleteProps) {
  const router = useRouter();
  return (
    <div className="relative flex select-none items-center rounded-sm py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50">
      <AlertDialog>
        <AlertDialogTrigger className="flex items-center">
          <Button variant="destructive">Supprimer définitivement</Button>
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
            {itemId && Delete ? (
              <AlertDialogAction
                onClick={async () => {
                  await Delete(itemId);
                  router.push("/dashboard");
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
