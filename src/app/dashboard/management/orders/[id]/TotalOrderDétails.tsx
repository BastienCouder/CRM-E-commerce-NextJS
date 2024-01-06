import formatPrice from "../../../../../../format";
import { OrderProps } from "@/lib/db/orderItem";

interface TotalOrderDetailsProps {
  order: OrderProps;
}

export default async function TotalOrderDetails({
  order,
}: TotalOrderDetailsProps) {
  return (
    <>
      {order && (
        <>
          <div className="flex flex-col space-y-2">
            <p>
              Prix de la commande :{" "}
              <span className="font-bold">
                {formatPrice(order.cart.subtotal, "EUR")}
              </span>
            </p>
            <p>
              Prix de la livraison :{" "}
              <span className="font-bold">
                {formatPrice(order.deliveryOption.price, "EUR")}
              </span>
            </p>
            <p>
              Prix total :{" "}
              <span className="font-bold">
                {formatPrice(order.subtotal, "EUR")}
              </span>
            </p>
          </div>
        </>
      )}
    </>
  );
}
