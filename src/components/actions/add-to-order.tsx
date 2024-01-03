"use client";
import { Dictionary } from "@/app/lang/dictionaries";
import { Button } from "@/components/ui/button";
import { useDeliveryOptionId } from "@/hooks/useDeliveryOptionId";
import { DeliveryOption } from "@/schemas/DbSchema";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

interface AddToOrderProps {
  cartId: string;
  deliveryId: string;
  createOrder: (
    productId: string,
    deliveryId: string,
    deliveryOption: string
  ) => Promise<void>;
  deliveryOptions: DeliveryOption[];
  dict: Dictionary;
}
export default function AddToOrder({
  cartId,
  deliveryId,
  deliveryOptions,

  createOrder,
  dict,
}: AddToOrderProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const deliveryOptionId = useDeliveryOptionId();

  const deliveryOption = deliveryOptions.find(
    (item) => item.id === deliveryOptionId
  );

  return (
    <>
      <Button
        disabled={isPending}
        aria-label={dict.payment.proceed_to_payment}
        onClick={() => {
          startTransition(async () => {
            await createOrder(cartId, deliveryId, deliveryOption?.id!);
            router.push("/profile");
          });
        }}
      >
        {dict.payment.payment}
      </Button>
    </>
  );
}
