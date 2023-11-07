"use client";
import { DeliveryProps } from "@/lib/db/delivery";
import { Session } from "next-auth";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Toaster, toast } from "sonner";
import { Button } from "@/components/ui/button";

interface SelectDeliveryProps {
  delivery: DeliveryProps | null;
  session: Session | null;
  setDefaultDeliveryItem: (deliveryItemId: string) => void;
  DeleteDeliveryItem: (deliveryItemId: string) => void;
}

export default function SelectDelivery({
  delivery,
  session,
  setDefaultDeliveryItem,
  DeleteDeliveryItem,
}: SelectDeliveryProps) {
  const router = useRouter();
  const [selectedDeliveryItem, setSelectedDeliveryItem] = useState<
    string | undefined
  >(delivery?.deliveryItems.find((item) => item.Default)?.id);

  const handleDeliveryChange = (id: string) => {
    setSelectedDeliveryItem(id);
    handleDefaultDeliveryItem(id);
    toast.success("Adresse de livraison par défaut modifiée avec succès");
  };

  const handleDefaultDeliveryItem = (id: string) => {
    setDefaultDeliveryItem(id);
  };

  const handleDeleteDeliveryItem = (id: string) => {
    DeleteDeliveryItem(id);
    toast.success("Adresse de livraison supprimé avec succès");
  };

  useEffect(() => {
    setSelectedDeliveryItem(
      delivery?.deliveryItems.find((item) => item.Default)?.id
    );
  }, [delivery]);

  const handleSubmit = () => {
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
      <ul className="space-y-4 w-[35rem]">
        {session &&
          delivery?.deliveryItems &&
          delivery.deliveryItems.map((deliveryItem) => (
            <li
              key={deliveryItem.id}
              className="flex text-sm border-2 px-8 py-6 border-secondary"
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
      <Button onClick={handleSubmit}>Valider</Button>
      <Toaster expand={false} position="bottom-left" />
    </>
  );
}
