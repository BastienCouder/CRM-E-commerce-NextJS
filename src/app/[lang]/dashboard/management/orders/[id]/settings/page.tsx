import { cache } from "react";
import { notFound } from "next/navigation";
import OrderSettingsForm from "./OrderSettingsForm";
import { useServerUpdateStatus } from "@/app/dashboard/management/actions";

const getOrderItem = cache(async (id: string) => {
  const order = await prisma.orderItems.findUnique({
    where: { id },
    include: {
      cart: { include: { cartItems: true } },
      deliveryItems: true,
    },
  });

  if (!order) notFound();
  return order;
});

interface orderSettingsPageProps {
  params: {
    id: string;
  };
}

export default async function OrderSettingsPage({
  params: { id },
}: orderSettingsPageProps) {
  const order = await getOrderItem(id);

  return (
    <>
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium">Options</h3>
          <p className="text-sm text-muted-foreground">
            Mettez à jour les paramètres de la commande.
          </p>
        </div>
        <OrderSettingsForm
          order={order}
          orderId={id}
          UpdateStatus={useServerUpdateStatus}
        />
      </div>
    </>
  );
}
