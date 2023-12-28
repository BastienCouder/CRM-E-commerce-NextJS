import React from "react";
import { OrderItem } from "@/lib/DbSchema";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface LastOrderItemProps {
  orderItem: any; // Renommé en 'orders' pour refléter le fait qu'il s'agit d'un tableau
}

export default function LastOrderItem({ orderItem }: LastOrderItemProps) {
  const imageUrl = orderItem.cart?.cartItems?.[0]?.product?.imageUrl;
  return (
    <>
      <section>
        <div>
          <Avatar>
            {imageUrl ? (
              <AvatarImage src={imageUrl} />
            ) : (
              <AvatarFallback>CN</AvatarFallback>
            )}
          </Avatar>
        </div>
      </section>
    </>
  );
}
