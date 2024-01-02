"use client";
import { Session } from "next-auth";
import { MouseEventHandler, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Delivery, DeliveryItem, DeliveryOption } from "@/schemas/DbSchema";
import SelectDeliveryOptions from "@/components/SelectDeliveryOptions";
import { Dictionary } from "@/app/lang/dictionaries";
import { setLocalStorage } from "@/helpers/storageHelper";

interface SelectDeliveryProps {
  delivery: Delivery | null;
  session: Session | null;
  dict: Dictionary;
  deliveryOptions: DeliveryOption[];
  designateDefaultDeliveryItem: (deliveryItemId: string) => void;
  removeDeliveryItem: (deliveryItemId: string) => void;
}

export default function SelectDelivery({
  delivery,
  session,
  dict,
  deliveryOptions,
  designateDefaultDeliveryItem,
  removeDeliveryItem,
}: SelectDeliveryProps) {
  const router = useRouter();
  const defaultDeliveryItemId = delivery?.deliveryItems?.find(
    (item: DeliveryItem) => item.Default
  )?.id;
  const [selectedDeliveryItem, setSelectedDeliveryItem] = useState<
    string | undefined
  >(defaultDeliveryItemId);
  const [selectedDeliveryOption, setSelectedDeliveryOption] = useState<string>(
    deliveryOptions.length > 0 ? deliveryOptions[0].id : ""
  );

  useEffect(() => {
    setSelectedDeliveryItem(defaultDeliveryItemId);
  }, [defaultDeliveryItemId]);

  const handleDeliveryOptionsChange: (id: string) => void = (id: string) => {
    setSelectedDeliveryOption(id);
    setLocalStorage("selectedDeliveryOption", id);
    toast.success("Options de livraison par défaut modifiée avec succès");
  };

  const handleDeliveryChange: (id: string) => void = (id: string) => {
    setSelectedDeliveryItem(id);
    handleDefaultDeliveryItem(id);
    toast.success("Adresse de livraison par défaut modifiée avec succès");
  };

  const handleDefaultDeliveryItem: (id: string) => void = (id: string) => {
    designateDefaultDeliveryItem(id);
  };

  const handleDeleteDeliveryItem: (id: string) => void = (id: string) => {
    removeDeliveryItem(id);
    toast.success("Adresse de livraison supprimé avec succès");
  };

  useEffect(() => {
    setSelectedDeliveryItem(
      delivery?.deliveryItems?.find((item: DeliveryItem) => item.Default)?.id
    );
  }, [delivery]);

  const handleSubmit: MouseEventHandler<HTMLButtonElement> = () => {
    if (!session) {
      toast.error("Veuillez vous connecter");
      return;
    } else if (selectedDeliveryItem) {
      router.push("/cart/payment");
    } else {
      toast.error("Ajouter une adresse de livraison");
    }
  };
  return (
    <>
      <section className="flex gap-x-8">
        <ul className="space-y-4 w-[35rem]">
          {session &&
            delivery?.deliveryItems &&
            delivery.deliveryItems.map((deliveryItem: DeliveryItem) => (
              <li
                key={deliveryItem.id}
                className="flex text-sm border-2 px-8 py-6 border-white"
              >
                <div className="w-60">
                  <div className="flex flex-col font-bold">
                    <div className="capitalize flex space-x-2">
                      <p>{deliveryItem.name}</p>
                      <p>{deliveryItem.surname}</p>
                    </div>
                    <p>{deliveryItem.email}</p>
                  </div>
                  <p className="uppercase">{deliveryItem.address}</p>
                  <div className="flex">
                    <p className="flex gap-2">
                      <span className="uppercase">
                        {deliveryItem.city}, {deliveryItem.postcode},
                      </span>
                      {deliveryItem.country}
                    </p>
                  </div>
                  <p>{deliveryItem.tel}</p>
                </div>
                <div className="pl-12 space-y-4">
                  <div className="flex gap-x-4">
                    <div
                      onClick={() => handleDeliveryChange(deliveryItem.id)}
                      className={`mb-2 h-4 w-4 border-2 border-secondary cursor-pointer ${
                        selectedDeliveryItem === deliveryItem.id
                          ? "bg-secondary"
                          : ""
                      }`}
                    ></div>
                    {selectedDeliveryItem === deliveryItem.id
                      ? "Adresse par défaut"
                      : ""}
                  </div>
                  <p
                    onClick={() => handleDeleteDeliveryItem(deliveryItem.id)}
                    className="text-red-600 cursor-pointer w-28 px-3 py-2 border-[1px] border-red-600"
                  >
                    Supprimer
                  </p>
                </div>
              </li>
            ))}
        </ul>
        <SelectDeliveryOptions
          deliveryOptions={deliveryOptions}
          selectedDeliveryOption={selectedDeliveryOption}
          handleDeliveryOptionsChange={handleDeliveryOptionsChange}
          dict={dict}
        />
      </section>
      <Button aria-label="Valider" onClick={handleSubmit}>
        Valider
      </Button>
    </>
  );
}
