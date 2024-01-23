import { cache } from "react";
import { notFound } from "next/navigation";
import SettingsForm from "@/components/dashboard/settings-form";
import { updateStatusItem } from "@/app/dashboard/management/action/update-status";

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
        <SettingsForm
          item={order}
          itemId={id}
          updateStatus={updateStatusItem}
          type="order"
        />
      </div>
    </>
  );
}
