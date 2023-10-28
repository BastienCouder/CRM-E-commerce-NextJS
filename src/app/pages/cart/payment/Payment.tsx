"use client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { useTransition } from "react";
import { createOrderIncrementation } from "./action";
import { Toaster, toast } from "sonner";

interface PaymentProps {
  cartId: string;
  deliveryId: string;
  createOrderIncrementation: (
    productId: string,
    variantId: string
  ) => Promise<void>;
}
export default function Payment({
  cartId,
  deliveryId,
  createOrderIncrementation,
}: PaymentProps) {
  const [isPending, startTransition] = useTransition();

  return (
    <>
      <button
        onClick={() => {
          startTransition(async () => {
            await createOrderIncrementation(cartId, deliveryId);
            const promise = () =>
              new Promise((resolve) => setTimeout(resolve, 2000));

            toast.promise(promise, {
              loading: "Chargement...",
              success: () => {
                return `Produit ajouté avec succès`;
              },
              error: "Error",
            });
          });
        }}
      >
        creer order
      </button>
    </>
  );
}
