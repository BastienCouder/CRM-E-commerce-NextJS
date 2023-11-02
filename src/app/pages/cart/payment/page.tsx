import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { createOrderIncrementation, handleStripePayment } from "./action";
import { getCart } from "@/lib/db/cart";
import { getDelivery } from "@/lib/db/delivery";
import Payment from "./Payment";
import { redirect } from "next/navigation";
import { loadStripe } from "@stripe/stripe-js";
import axios from "axios";
import { createStripeSession } from "@/app/api/create-stripe-session/route";

export default async function Delivery() {
  const session = getServerSession(authOptions);
  const cart = await getCart();
  const delivery = await getDelivery();

  if (!session) {
    redirect("/auth");
  }

  return (
    <>
      hello
      {cart && delivery && (
        <>
          <Payment
            cartId={cart.id}
            deliveryId={delivery.id}
            handleStripePayment={handleStripePayment}
            createOrderIncrementation={createOrderIncrementation}
          />
        </>
      )}
    </>
  );
}
