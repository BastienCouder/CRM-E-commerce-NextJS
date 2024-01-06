"use client";
import { Dictionary } from "@/app/lang/dictionaries";
import { Button } from "@/components/ui/button";
import { useDeliveryOptionId } from "@/hooks/useDeliveryOptionId";
import getStripe, { stripe } from "@/lib/stripe";
import { loadStripe } from "@stripe/stripe-js";

import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";

interface AddToOrderProps {
  cartId: string;
  deliveryId: string;
  createOrder: (
    cartId: string,
    deliveryId: string,
    deliveryOptionId: string
  ) => Promise<void>;

  dict: Dictionary;
}

export default function AddToOrder({
  cartId,
  deliveryId,

  createOrder,
  dict,
}: AddToOrderProps) {
  const [isPending, startTransition] = useTransition();

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
      console.log("stripe", stripe);

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
        onClick={() => startTransition(handleStripeCheckout)}
      >
        {dict.payment.payment}
      </Button>
    </>
  );
}
