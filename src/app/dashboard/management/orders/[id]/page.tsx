import { Separator } from "@/components/ui/separator";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";
import { getOrderItemId } from "@/lib/db/orderItem";
import { CartItem, OrderItem } from "@/schemas/DbSchema";
import CartItemsDetails from "@/components/profile/cartItems-details";
import DeliveryDetails from "@/components/profile/delivery-details";
import { getDictionary } from "@/app/lang/dictionaries";
import TotalOrderDetails from "./TotalOrderDétails";

const getOrderItem = cache(async (id: string) => {
  const order = await getOrderItemId(id);

  if (!order) notFound();

  return order as OrderItem;
});

export async function generateMetadata({
  params: { id },
}: OrderIdDashboardProps): Promise<Metadata> {
  const order = await getOrderItem(id);

  return {
    title: "Dashboard - commande n°" + order.orderNumber + " - E-commerce",
  };
}

interface OrderIdDashboardProps {
  params: {
    id: string;
    lang: string;
  };
}
export default async function OrderIdDashboard({
  params: { id, lang },
}: OrderIdDashboardProps) {
  const order = await getOrderItem(id);
  const dict = await getDictionary(lang);

  return (
    <>
      <div className="space-y-4">
        <h2 className="font-medium">Détail de la commande</h2>
        <section className="space-y-4">
          <Separator />
          <article className="py-2">
            <h3 className="text-lg font-medium">
              {order && order.cart.cartItems.length > 1
                ? "Produits"
                : "Produit"}
            </h3>
            <ul className="mt-4 space-x-4 flex w-full h-full">
              <div className="flex flex-col justify-center md:justify-start md:flex-row flex-wrap gap-8">
                {order.cart &&
                  order.cart.cartItems.map((cartItem: CartItem) => (
                    <CartItemsDetails
                      key={cartItem.id}
                      cartItem={cartItem}
                      dict={dict}
                    />
                  ))}
              </div>
            </ul>
          </article>
          <Separator />
          <article className="py-2">
            <h3 className="text-lg font-medium">Adresse de livraison</h3>
            <div className="mt-4 border-l-2 border-primary pl-4 text-sm border-primary">
              <DeliveryDetails deliveryItem={order.deliveryItems} dict={dict} />
            </div>
          </article>
          <Separator />
          <article className="py-2">
            <h3 className="text-lg font-medium">Total de la commande</h3>
            <div className="mt-4 border-l-2 border-primary pl-4 text-sm border-primary">
              <TotalOrderDetails order={order} />
            </div>
          </article>
        </section>
      </div>
    </>
  );
}
