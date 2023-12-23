"use client";

import formatPrice from "@/helpers/format";
import { Order } from "../../lib/zod";

interface TotalOrderProps {
  order: any;
}

export default function TotalOrder({ order }: TotalOrderProps) {
  return (
    <>
      {order && (
        <>
          <div className="flex flex-col space-y-2">
            <p>
              Prix du panier :{" "}
              <span className="font-bold">
                {formatPrice(order.subtotal, "EUR")}
              </span>
            </p>
            <p>
              Prix de la livraison :{" "}
              <span className="font-bold">
                {formatPrice(order.subtotal, "EUR")}
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
