import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

import Logout from "@/components/Logout";
import { getOrder } from "@/lib/db/order";

export default async function dashboardPage() {
  const session = await getServerSession(authOptions);
  const order = await getOrder();
  if (order?.orderItems) {
    order.orderItems.forEach((orderItem) => {
      if (orderItem.cart) {
        console.log("cartItems: ", orderItem.cart.cartItems);
      }
    });
  }
  if (order?.orderItems) {
    order.orderItems.forEach((orderItem) => {
      if (orderItem.delivery) {
        console.log("deliveryItems: ", orderItem.delivery.deliveryItems);
      }
    });
  }
  if (!session) {
    redirect("/auth");
  }
  return (
    <div>
      dashboard
      <Logout />
    </div>
  );
}
