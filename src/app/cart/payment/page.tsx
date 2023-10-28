import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { createOrderIncrementation } from "./action";
import { getCart } from "@/lib/db/cart";
import { getDelivery } from "@/lib/db/delivery";
import Payment from "./Payment";
import Loading from "@/app/loading";
import { getOrder } from "@/lib/db/order";

export default async function Delivery() {
  const cart = await getCart();
  const delivery = await getDelivery();

  return (
    <>
      hello
      {cart && delivery && (
        <>
          <Payment
            cartId={cart.id}
            deliveryId={delivery.id}
            createOrderIncrementation={createOrderIncrementation}
          />
          <button>order</button>
        </>
      )}
    </>
  );
}
