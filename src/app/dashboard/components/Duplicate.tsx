"use client";

import { Button } from "@/components/ui/button";
import { Product } from "@prisma/client";

interface DuplicateProps {
  productId: string;
  DuplicateProduct: (productId: string) => Promise<Product>;
  type: string;
}

export default function Duplicate({
  type,
  DuplicateProduct,
  productId,
}: DuplicateProps) {
  return (
    <>
      {type === "actions" && (
        <div
          className="flex w-full items-center justify-between p-0 cursor-pointer"
          onClick={async () => {
            await DuplicateProduct(productId);
          }}
        >
          Faire une copie
        </div>
      )}

      {type === "settings" && (
        <Button
          variant="outline"
          size="lg"
          onClick={async () => {
            await DuplicateProduct(productId);
          }}
        >
          Faire une copie
        </Button>
      )}
    </>
  );
}
