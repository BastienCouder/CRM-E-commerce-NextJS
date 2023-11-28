"use client";

import { Button } from "@/components/ui/button";
import { Product } from "@prisma/client";
import { Star } from "lucide-react";

interface RestoreProps {
  productId: string;
  productPriority: string | null;
  FavoriteProduct: (
    productId: string,
    newFavorites: string
  ) => Promise<Product>;
  type: string;
}

export default function Favories({
  type,
  productPriority,
  FavoriteProduct,
  productId,
}: RestoreProps) {
  return (
    <>
      {type === "actions" && (
        <div
          className="flex w-full items-center justify-between p-0 cursor-pointer"
          onClick={async () => {
            await FavoriteProduct(productId, "favorites");
          }}
        >
          Favorie
          {productPriority === "favorites" ? (
            <Star color="#da8e0b" size={15} />
          ) : (
            <Star size={15} />
          )}
        </div>
      )}

      {type === "settings" && (
        <Button
          variant="outline"
          size="lg"
          onClick={async () => {
            await FavoriteProduct(productId, "favorites");
          }}
        >
          Restorer
        </Button>
      )}
    </>
  );
}
