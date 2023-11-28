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

interface RestoreProps {
  productId: string;
  RestoreProduct: (productId: string) => Promise<Product>;
  type: string;
}

export default function Restore({
  type,
  RestoreProduct,
  productId,
}: RestoreProps) {
  return (
    <div className="relative flex cursor-default select-none items-center rounded-sm py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50">
      {type === "settings" && (
        <Button
          variant="outline"
          size="lg"
          onClick={async () => {
            await RestoreProduct(productId);
          }}
        >
          Restorer
        </Button>
      )}
    </div>
  );
}
