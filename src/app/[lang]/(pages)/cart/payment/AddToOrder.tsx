"use client";
import { Dictionary } from "@/app/[lang]/dictionaries/dictionaries";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

interface AddToOrderProps {
  cartId: string;
  deliveryId: string;
  handleStripePayment: (productId: string, variantId: string) => Promise<void>;
  createOrderIncrementation: (
    productId: string,
    variantId: string
  ) => Promise<void>;
  dict: Dictionary;
}
export default function AddToOrder({
  cartId,
  deliveryId,
  handleStripePayment,
  createOrderIncrementation,
  dict,
}: AddToOrderProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  return (
    <>
      <Button
        aria-label={dict.payment.proceed_to_payment}
        onClick={() => {
          startTransition(async () => {
            await handleStripePayment(cartId, deliveryId);
            await createOrderIncrementation(cartId, deliveryId);
            router.push("/profile");
          });
        }}
      >
        {dict.payment.payment}
      </Button>
    </>
  );
}
