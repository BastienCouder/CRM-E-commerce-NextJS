"use client";
import { DeliveryProps } from "@/lib/db/delivery";
import DeliveryInfo from "./delivery-info";
import FormDelivery from "@/components/delivery/form-delivery";
import { Separator } from "@/components/ui/separator";
import { designateDefaultDeliveryItem } from "@/app/(pages)/actions/designate-delivery-form";
import { removeDeliveryItem } from "@/app/(pages)/actions/delete-delivery";
import { updateDeliveryFormData } from "@/app/(pages)/actions/update-delivery-form";
import { ScrollArea } from "../ui/scroll-area";

interface InformationUserProps {
  delivery: DeliveryProps | null;
}

export default function InformationUser({ delivery }: InformationUserProps) {
  return (
    <ScrollArea className="h-[80vh] px-4">
      <div className="space-y-4">
        <h2 className="text-2xl text-center md:text-start">
          Addresse de livraison
        </h2>
        <Separator />
        <FormDelivery />
        <DeliveryInfo
          delivery={delivery}
          setDefaultDeliveryItem={designateDefaultDeliveryItem}
          DeleteDeliveryItem={removeDeliveryItem}
          UpdateDeliveryForm={updateDeliveryFormData}
        />
      </div>
    </ScrollArea>
  );
}
