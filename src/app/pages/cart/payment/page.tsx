import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getCart } from "@/lib/db/cart";
import { getDelivery } from "@/lib/db/delivery";
import { redirect } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import DeliveryDetails from "./DeliveryDetails";
import CartItem from "./CartItem";
import { createOrderIncrementation, handleStripePayment } from "./action";
import AddToOrder from "./AddToOrder";

export default async function Payment() {
  // const session = getServerSession(authOptions);
  const cart = await getCart();
  const delivery = await getDelivery();

  // if (!session) {
  //   redirect("/auth");
  // }

  let deliveryItem = null;
  if (delivery) {
    deliveryItem = delivery.deliveryItems.find((item) => item.Default);
  }

  return (
    <>
      <div className="px-12 lg:px-0 space-y-4 pt-4">
        <h1 className="text-4xl text-center md:text-start">Récapitulatif</h1>
        <Separator className="bg-primary" />
        <section className="space-y-8">
          <article>
            <h2 className="text-2xl">
              {cart && cart.cartItems.length > 1 ? "Produits" : "Produit"}
            </h2>
            <ul className="mt-8 flex flex flex-col justify-center md:justify-start md:flex-row flex-wrap gap-8 md:gap-24 w-full">
              {cart &&
                cart.cartItems.map((cartItem) => (
                  <CartItem key={cartItem.id} cartItem={cartItem} />
                ))}
            </ul>
          </article>
          <Separator className="bg-primary" />
          <DeliveryDetails deliveryItem={deliveryItem} />
        </section>
        <div className="pt-4">
          {cart && delivery && (
            <AddToOrder
              cartId={cart.id}
              deliveryId={delivery.id}
              handleStripePayment={handleStripePayment}
              createOrderIncrementation={createOrderIncrementation}
            />
          )}
        </div>
      </div>
    </>
  );
}
