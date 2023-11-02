import { Stripe, loadStripe } from "@stripe/stripe-js";
import StripeSession from "stripe";
import { env } from "./env";

export const stripe = new StripeSession(env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2023-10-16",
});

let stripePromise: Promise<Stripe | null>;
const getStripe = async () => {
  if (!stripePromise) {
    stripePromise = loadStripe(env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);
  }
  return await stripePromise;
};

export default getStripe;
