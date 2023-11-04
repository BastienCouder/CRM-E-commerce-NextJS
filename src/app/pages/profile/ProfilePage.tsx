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
import { Separator } from "@/components/ui/separator";
import UserInfo from "./UserInfo";

interface ProfilePageProps {
  session: Session | null;
  delivery: DeliveryProps | null;
}

export default function ProfilePage({ session, delivery }: ProfilePageProps) {
  return (
    <div className="my-12 space-y-12">
      <div className="space-y-8">
        <h2 className="text-2xl text-center md:text-start">Profil</h2>
        <Separator />
        <UserInfo session={session} />
        <Separator />
      </div>
      <div className="space-y-8">
        <h2 className="text-2xl text-center md:text-start">
          Addresse de livraison
        </h2>
        <Separator />
        <FormDelivery deliveryForm={useServerDeliveryForm} session={session} />
        <DeliveryInfo
          delivery={delivery}
          setDefaultDeliveryItem={useServerSetDefaultDeliveryItem}
          DeleteDeliveryItem={useServerDeleteDeliveryItem}
          UpdateDeliveryForm={useServerUpdateDeliveryForm}
          session={session}
        />
      </div>
    </div>
  );
}
