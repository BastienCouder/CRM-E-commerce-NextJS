"use client";
import { Dictionary } from "@/app/lang/dictionaries";
import { useDeliveryOptionId } from "@/hooks/useDeliveryOptionId";
import { DeliveryItem, DeliveryOption } from "@/schemas/DbSchema";

interface DeliveryDetailsProps {
  deliveryItem: DeliveryItem;
  dict: Dictionary;
  deliveryOptions?: DeliveryOption[];
}

export default function DeliveryDetails({
  deliveryItem,
  dict,
  deliveryOptions,
}: DeliveryDetailsProps) {
  const deliveryOptionId = useDeliveryOptionId();

  const deliveryOption = deliveryOptions?.find(
    (item) => item.id === deliveryOptionId
  );

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
            {deliveryOption && (
              <div className="mt-4">
                <h3>{deliveryOption.name}</h3>
                <p>{deliveryOption.description}</p>
                <p>{deliveryOption.price}</p>
              </div>
            )}
          </>
        )}
      </div>
    </article>
  );
}
