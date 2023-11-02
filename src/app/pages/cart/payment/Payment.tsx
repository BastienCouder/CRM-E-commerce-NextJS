"use client";
import { useTransition } from "react";

interface PaymentProps {
  cartId: string;
  deliveryId: string;
  handleStripePayment: (productId: string, variantId: string) => Promise<void>;
  createOrderIncrementation: (
    productId: string,
    variantId: string
  ) => Promise<void>;
}
export default function Payment({
  cartId,
  deliveryId,
  handleStripePayment,
  createOrderIncrementation,
}: PaymentProps) {
  const [isPending, startTransition] = useTransition();

  return (
    <>
      <button
        onClick={() => {
          startTransition(async () => {
            await handleStripePayment(cartId, deliveryId);
            await createOrderIncrementation(cartId, deliveryId);
          });
        }}
      >
        creer order
      </button>
    </>
  );
}
