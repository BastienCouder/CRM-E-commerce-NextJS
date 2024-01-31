"use client";
import { Product } from "@/schemas/db-schema";

import { Separator } from "../ui/separator";

interface LatestPurchasedProductsProps {
  latestProducts: Product[] | null;
}
export default function LatestPurchasedProducts({
  latestProducts,
}: LatestPurchasedProductsProps) {
  if (!latestProducts) {
    return null;
  }

  return (
    <>
      <section className="border w-1/3 h-[14rem] p-4 rounded-lg bg-card space-y-4">
        <h2>Derniers produits achetés</h2>
        <Separator className="bg-[rgba(var(--foreground),0.5)]" />

        <ul>
          {latestProducts.slice(0, 5).map((product, index) => (
            <li key={index}>
              <div>{product.name}</div>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
