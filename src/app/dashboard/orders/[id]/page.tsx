import { Separator } from "@/components/ui/separator";
import { prisma } from "@/lib/db/prisma";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";
import CartItem from "./CartItem";
import DeliveryDetails from "./DeliveryDetails";
import TotalOrder from "./TotalOrder";
import { calculateSubtotal } from "../../lib/utils";

interface OrderPageProps {
  params: {
    id: string;
  };
}

const getOrder = cache(async (id: string) => {
  const order = await prisma.orderItems.findUnique({
    where: { id },

    include: {
      cart: {
        include: {
          cartItems: {
            include: {
              product: { include: { variants: true, category: true } },
            },
          },
        },
      },
      deliveryItems: true,
    },
  });

  if (!order) notFound();
  const subtotal = calculateSubtotal(order);

  return {
    ...order,
    subtotal,
  };
});

export async function generateMetadata({
  params: { id },
}: OrderPageProps): Promise<Metadata> {
  const order = await getOrder(id);

  return {
    title: "Dashboard - commande n°" + order.orderNumber + " - E-commerce",
  };
}

export default async function OrderPage({ params: { id } }: OrderPageProps) {
  const order = await getOrder(id);

  return (
    <>
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Détail de la commande</h3>
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
                  order.cart.cartItems.map((cartItem) => (
                    <CartItem key={cartItem.id} cartItem={cartItem} />
                  ))}
              </div>
            </ul>
          </article>
          <Separator />
          <article className="py-2">
            <h3 className="text-lg font-medium">Adresse de livraison</h3>
            <div className="mt-4 border-l-2 border-primary pl-4 text-sm border-primary">
              <DeliveryDetails deliveryItem={order.deliveryItems} />
            </div>
          </article>
          <Separator />
          <article className="py-2">
            <h3 className="text-lg font-medium">Total de la commande</h3>
            <div className="mt-4 border-l-2 border-primary pl-4 text-sm border-primary">
              <TotalOrder order={order} />
            </div>
          </article>
        </section>
      </div>
    </>
  );
}
