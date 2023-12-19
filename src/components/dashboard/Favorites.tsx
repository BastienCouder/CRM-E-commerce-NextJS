"use client";

import { Product } from "@prisma/client";
import { Star } from "lucide-react";

interface FavoritesProps {
  productId: string;
  productPriority: string[] | null;
  Favorite: (productId: string, newFavorites: string) => Promise<any>;
  type: string;
}

export default function Favorites({
  type,
  productPriority,
  Favorite,
  productId,
}: FavoritesProps) {
  const isFavorite = productPriority?.includes("favorie");

  return (
    <>
      {type === "actions" && (
        <div
          className="flex w-full items-center justify-between p-0 cursor-pointer"
          onClick={async () => {
            await Favorite(productId, "favorie");
          }}
        >
          Favorie
          {isFavorite ? <Star color="#da8e0b" size={15} /> : <Star size={15} />}
        </div>
      )}
    </>
  );
}
