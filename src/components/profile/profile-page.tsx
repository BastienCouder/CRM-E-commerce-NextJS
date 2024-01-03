"use client";
import { DeliveryProps } from "@/lib/db/delivery";
import DeliveryInfo from "./delivery-info";
import { Session } from "next-auth";
import FormDelivery from "@/components/delivery/form-delivery";
import { Separator } from "@/components/ui/separator";
import UserInfo from "./user-info";
import { processDeliveryForm } from "@/app/(pages)/actions/process-delivery-form";
import { designateDefaultDeliveryItem } from "@/app/(pages)/actions/designate-delivery-form";
import { removeDeliveryItem } from "@/app/(pages)/actions/remove-deliveryItem";
import { updateDeliveryFormData } from "@/app/(pages)/actions/update-delivery-form";

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
        <FormDelivery
          processDeliveryForm={processDeliveryForm}
          session={session}
        />
        <DeliveryInfo
          delivery={delivery}
          setDefaultDeliveryItem={designateDefaultDeliveryItem}
          DeleteDeliveryItem={removeDeliveryItem}
          UpdateDeliveryForm={updateDeliveryFormData}
          session={session}
        />
      </div>
    </div>
  );
}
