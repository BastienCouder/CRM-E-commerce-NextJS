"use client";
import Input from "@/components/Input";
import { DeliveryProps } from "@/lib/db/delivery";
import { Session } from "next-auth";
import formStyles from "@/styles/FormDelivery.module.css";
import { useCallback, useEffect, useId, useState } from "react";
import { Toaster, toast } from "sonner";
import { Button } from "@/components/ui/button";

interface DeliveryInfoProps {
  delivery: DeliveryProps | null;
  setDefaultDeliveryItem: (deliveryItemId: string) => void;
  DeleteDeliveryItem: (deliveryItemId: string) => void;
  UpdateDeliveryForm: (
    deliveryItemId: string,
    formData: FormData
  ) => Promise<void>;
  session: Session | null;
}

export default function DeliveryInfo({
  delivery,
  setDefaultDeliveryItem,
  DeleteDeliveryItem,
  UpdateDeliveryForm,
  session,
}: DeliveryInfoProps) {
  const [selectedDeliveryItem, setSelectedDeliveryItem] = useState<
    string | undefined
  >(delivery?.deliveryItems.find((item) => item.Default)?.id);

  const handleDeliveryChange = (id: string) => {
    setSelectedDeliveryItem(id);
    handleDefaultDeliveryItem(id);
    toast.success("Addresse de livraison par défaut modifiée avec succès");
  };

  const handleDefaultDeliveryItem = (id: string) => {
    setDefaultDeliveryItem(id);
  };

  const handleDeleteDeliveryItem = (id: string) => {
    DeleteDeliveryItem(id);
    toast.success("Addresse de livraison supprimé avec succès");
  };

  useEffect(() => {
    setSelectedDeliveryItem(
      delivery?.deliveryItems.find((item) => item.Default)?.id
    );
  }, [delivery]);

  const emailId = useId();
  const [formVisible, setFormVisible] = useState(false);

  const toggleFormVisibility = useCallback(async () => {
    setFormVisible(!formVisible);
  }, [formVisible]);

  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    email: "",
    address: "",
    postcode: "",
    city: "",
    country: "France",
    tel: "",
  });

  const deliveryItem = delivery?.deliveryItems.find(
    (item) => item.id === selectedDeliveryItem
  );

  useEffect(() => {
    if (deliveryItem) {
      setFormData({
        ...deliveryItem,
      });
    }
  }, [deliveryItem]);

  const [error, setError] = useState<string | null>(null);

  const countries = [
    "Allemagne",
    "Belgique",
    "Espagne",
    "France",
    "Irlande",
    "Italie",
    "Luxembourg",
    "Malte",
    "Portugal",
    "Roumanie",
    "Royaume-uni",
  ];

  const { name, surname, email, address, postcode, city, country, tel } =
    formData;

  const handleFormDeliveryChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!session || !session.user) {
      setError("Veuillez vous connecter");
      return;
    }

    const form = new FormData();
    form.append("name", name);
    form.append("surname", surname);
    form.append("email", email);
    form.append("address", address);
    form.append("country", country);
    form.append("postcode", postcode);
    form.append("city", city);
    form.append("tel", tel);

    try {
      if (deliveryItem?.id) {
        await UpdateDeliveryForm(deliveryItem.id, form);
        toggleFormVisibility();
        toast.success("Addresse de livraison modifiée avec succès");
      }
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      }
    }
  };

  return (
    <div className="space-y-4">
      <ul className="space-y-4 w-[35rem]">
        {delivery?.deliveryItems &&
          delivery.deliveryItems.map((deliveryItem) => (
            <li
              key={deliveryItem.id}
              className="flex text-sm border-2 px-8 py-6 border-zinc-800"
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
                    className={`mb-2 h-4 w-4 border-2 border-white cursor-pointer ${
                      selectedDeliveryItem === deliveryItem.id ? "bg-white" : ""
                    }`}
                  ></div>
                  {selectedDeliveryItem === deliveryItem.id
                    ? "Adresse par défaut"
                    : ""}
                </div>
                <button
                  onClick={toggleFormVisibility}
                  className="text-blue-500 cursor-pointer w-28 px-3 py-2 border-[1px] border-blue-500"
                >
                  modifier
                </button>
                <button
                  onClick={() => handleDeleteDeliveryItem(deliveryItem.id)}
                  className="text-red-600 cursor-pointer w-28 px-3 py-2 border-[1px] border-red-600"
                >
                  Supprimer
                </button>
              </div>
            </li>
          ))}
      </ul>
      {formVisible && (
        <div className="py-4">
          <form
            onSubmit={handleSubmit}
            className="w-full md:w-[45rem] space-y-6"
          >
            {error ? <small className="text-red-500">{error}</small> : null}
            <div className="flex flex-col sm:flex-row gap-6 sm:gap-12">
              <Input
                autoComplete={true}
                required={false}
                id="name"
                type="text"
                label="Prénom"
                name="name"
                value={name}
                onChange={handleFormDeliveryChange}
              />
              <Input
                autoComplete={true}
                required={false}
                id="surname"
                type="text"
                label="Nom"
                name="surname"
                value={surname}
                onChange={handleFormDeliveryChange}
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-6 sm:gap-12">
              <Input
                autoComplete={true}
                required={false}
                id={emailId}
                type="email"
                label="Email"
                name="email"
                value={email}
                onChange={handleFormDeliveryChange}
              />
              <Input
                autoComplete={true}
                required={false}
                id="tel"
                type="tel"
                label="Téléphone"
                name="tel"
                value={tel}
                onChange={handleFormDeliveryChange}
              />
            </div>
            <select
              id="country"
              name="country"
              value={country}
              onChange={handleFormDeliveryChange}
              className={`${formStyles.select} bg-zinc-800 px-4 py-2`}
            >
              {countries.map((country, index) => (
                <option key={index} value={country} className={` bg-zinc-800`}>
                  {country}
                </option>
              ))}
            </select>
            <Input
              autoComplete={true}
              required={false}
              id="address"
              type="text"
              label="Adresse"
              name="address"
              value={address}
              onChange={handleFormDeliveryChange}
            />
            <Input
              autoComplete={true}
              required={false}
              id="postcode"
              type="text"
              label="Code postal"
              name="postcode"
              value={postcode}
              onChange={handleFormDeliveryChange}
            />
            <Input
              autoComplete={true}
              required={false}
              id="city"
              type="text"
              label="Ville"
              name="city"
              value={city}
              onChange={handleFormDeliveryChange}
            />
            <Button>Modifier</Button>
          </form>
        </div>
      )}
      <Toaster expand={false} position="bottom-left" />
    </div>
  );
}
