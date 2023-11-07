"use client";
import { Button } from "@/components/ui/button";
import { useTransition } from "react";

interface AddToOrderProps {
  cartId: string;
  deliveryId: string;
  handleStripePayment: (productId: string, variantId: string) => Promise<void>;
  createOrderIncrementation: (
    productId: string,
    variantId: string
  ) => Promise<void>;
}
export default function AddToOrder({
  cartId,
  deliveryId,
  handleStripePayment,
  createOrderIncrementation,
}: AddToOrderProps) {
  const [isPending, startTransition] = useTransition();

  return (
    <>
      <Button
        onClick={() => {
          startTransition(async () => {
            await handleStripePayment(cartId, deliveryId);
            await createOrderIncrementation(cartId, deliveryId);
          });
        }}
      >
        Paiement
      </Button>
    </>
  );
}
