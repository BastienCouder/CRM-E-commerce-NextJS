"use client";

interface DeliveryDetailsProps {
  deliveryItem: any;
}

export default function DeliveryDetails({
  deliveryItem,
}: DeliveryDetailsProps) {
  return (
    <>
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
    </>
  );
}
