"use client";
import { createNewOrder } from "@/app/(pages)/actions/create-order-session";
import { Dictionary } from "@/app/lang/dictionaries";
import { Button } from "@/components/ui/button";
import { useDeliveryOptionId } from "@/hooks/useDeliveryOptionId";
import { loadStripe } from "@stripe/stripe-js";
import { useTransition } from "react";

interface AddToOrderProps {
  cartId: string;
  deliveryId: string;
  dict: Dictionary;
}

export default function AddToOrder({
  cartId,
  deliveryId,
  dict,
}: AddToOrderProps) {
  const [isPending, startTransition] = useTransition();
  const deliveryOptionId = useDeliveryOptionId();

  const handleStripeCheckout = async () => {
    try {
      const response = await fetch("/api/checkout_sessions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const checkoutSession = await response.json();

      const stripe = await loadStripe(
        `${process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY}`
      );

      if (!stripe) {
        throw new Error("Stripe n'est pas initialisé");
      }
      const result = await stripe.redirectToCheckout({
        sessionId: checkoutSession.id,
      });

      if (result.error) {
        console.warn(result.error.message);
      }
    } catch (error) {
      console.error(
        "An error occurred during the Stripe checkout process",
        error
      );
    }
  };
  return (
    <>
      <Button
        disabled={isPending}
        aria-label={dict.payment.proceed_to_payment}
        onClick={() =>
          startTransition(() => {
            handleStripeCheckout();
            createNewOrder(cartId, deliveryId, deliveryOptionId!);
          })
        }
      >
        {dict.payment.payment}
      </Button>
    </>
  );
}
