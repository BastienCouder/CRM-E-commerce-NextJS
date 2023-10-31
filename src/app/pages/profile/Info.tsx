"use client";
import { DeliveryProps } from "@/lib/db/delivery";
import DeliveryInfo from "./DeliveryInfo";
import {
  useServerDeleteDeliveryItem,
  useServerUpdateDeliveryForm,
  useServerSetDefaultDeliveryItem,
  useServerDeliveryForm,
} from "../cart/delivery/actions";
import { Session } from "next-auth";
import FormDelivery from "@/components/FormDelivery";

interface UserInfoProps {
  session: Session | null;
  delivery: DeliveryProps | null;
}

export default function Info({ session, delivery }: UserInfoProps) {
  return (
    <div className="my-12 space-y-4">
      <h2 className="text-2xl text-center md:text-start">
        Addresse de livraison
      </h2>
      <FormDelivery deliveryForm={useServerDeliveryForm} session={session} />
      <DeliveryInfo
        delivery={delivery}
        setDefaultDeliveryItem={useServerSetDefaultDeliveryItem}
        DeleteDeliveryItem={useServerDeleteDeliveryItem}
        UpdateDeliveryForm={useServerUpdateDeliveryForm}
        session={session}
      />
    </div>
  );
}
