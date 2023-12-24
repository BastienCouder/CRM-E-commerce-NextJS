"use client";
import { Dictionary } from "@/app/[lang]/dictionaries/dictionaries";
import { DeliveryItemWithdeliveryOption } from "@/lib/db/delivery";

interface DeliveryDetailsProps {
  deliveryItem: DeliveryItemWithdeliveryOption;
  dict: Dictionary;
}

export default function DeliveryDetails({
  deliveryItem,
  dict,
}: DeliveryDetailsProps) {
  return (
    <article className="space-y-2">
      <h2 className="text-2xl">{dict.payment.delivery_address}</h2>
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
