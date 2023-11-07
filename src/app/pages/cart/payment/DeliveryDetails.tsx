"use client";
import { DeliveryItemsProps } from "@/lib/db/delivery";

interface DeliveryDetailsProps {
  deliveryItem: any;
}

export default function DeliveryDetails({
  deliveryItem,
}: DeliveryDetailsProps) {
  return (
    <article className="space-y-2">
      <h2 className="text-2xl">Adresse de livraison</h2>
      <div className="text-sm border-b-2 pb-8 border-primary">
        {deliveryItem && (
          <>
            <div className="font-bold capitalize flex space-x-2">
              <p>{deliveryItem.name}</p>
              <p>{deliveryItem.surname}</p>
            </div>
            <p className="uppercase">{deliveryItem.address}</p>
            <div className="flex">
              <p className="flex gap-2">
                <span className="uppercase">
                  {deliveryItem.city},{deliveryItem.postcode},
                </span>
                {deliveryItem.country}
              </p>
            </div>
            <p>{deliveryItem.tel}</p>
          </>
        )}
      </div>
    </article>
  );
}
