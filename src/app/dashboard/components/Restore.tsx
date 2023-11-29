"use client";

import { Button } from "@/components/ui/button";
import { Order, Product } from "@prisma/client";

interface RestoreProps {
  itemId: string;
  RestoreProduct: (itemId: string) => Promise<Product | Order>;
  type: string;
}

export default function Restore({
  type,
  RestoreProduct,
  itemId,
}: RestoreProps) {
  return (
    <div className="relative flex cursor-default select-none items-center rounded-sm py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50">
      {type === "settings" && (
        <Button
          variant="outline"
          size="lg"
          onClick={async () => {
            await RestoreProduct(itemId);
          }}
        >
          Restorer
        </Button>
      )}
    </div>
  );
}
