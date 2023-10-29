"use client";
import Input from "@/components/Input";
import { useCallback, useId, useState } from "react";
import formStyles from "@/styles/FormDelivery.module.css";
import { Session } from "next-auth";
import SubmitButton from "@/components/SubmitButton";
import { Toaster, toast } from "sonner";

interface FormDeliveryProps {
  deliveryForm: (formData: FormData) => Promise<void>;
  session: Session | null;
}

export default function FormDelivery({
  deliveryForm,
  session,
}: FormDeliveryProps) {
  const emailId = useId();
  const [formVisible, setFormVisible] = useState(false);
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

  const handleDeliveryChange = (
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
      await deliveryForm(form);
      toggleFormVisibility();
      toast.success("Addresse de livraison ajoutée avec succès");

      setFormData({
        name: "",
        surname: "",
        email: "",
        address: "",
        postcode: "",
        city: "",
        country: "France",
        tel: "",
      });
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      }
    }
  };

  const toggleFormVisibility = useCallback(async () => {
    setFormVisible(!formVisible);
  }, [formVisible]);

  return (
    <>
      <div className="px-4 md:px-20 xl:p-0 space-y-8 ">
        <h1 className="text-4xl text-center md:text-start">Livraison</h1>
        <button
          onClick={toggleFormVisibility}
          className="px-3 py-2 border-zinc-800 border-2"
        >
          Ajouter une adresse de livraison{" "}
        </button>
        {formVisible && (
          <form
            onSubmit={handleSubmit}
            className="w-full md:w-[45rem] space-y-6"
          >
            {error ? <small className="text-red-500">{error}</small> : null}
            <div className="flex flex-col sm:flex-row gap-6 sm:gap-12">
              <Input
                autoComplete={true}
                required={true}
                id="name"
                type="text"
                label="Prénom"
                name="name"
                value={name}
                onChange={handleDeliveryChange}
              />
              <Input
                autoComplete={true}
                required={true}
                id="surname"
                type="text"
                label="Nom"
                name="surname"
                value={surname}
                onChange={handleDeliveryChange}
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-6 sm:gap-12">
              <Input
                autoComplete={true}
                required={true}
                id={emailId}
                type="email"
                label="Email"
                name="email"
                value={email}
                onChange={handleDeliveryChange}
              />
              <Input
                autoComplete={true}
                required={true}
                id="tel"
                type="tel"
                label="Téléphone"
                name="tel"
                value={tel}
                onChange={handleDeliveryChange}
              />
            </div>
            <select
              id="country"
              name="country"
              value={country}
              onChange={handleDeliveryChange}
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
              required={true}
              id="address"
              type="text"
              label="Adresse"
              name="address"
              value={address}
              onChange={handleDeliveryChange}
            />
            <Input
              autoComplete={true}
              required={true}
              id="postcode"
              type="text"
              label="Code postal"
              name="postcode"
              value={postcode}
              onChange={handleDeliveryChange}
            />
            <Input
              autoComplete={true}
              required={true}
              id="city"
              type="text"
              label="Ville"
              name="city"
              value={city}
              onChange={handleDeliveryChange}
            />
            <div className="pt-4">
              <SubmitButton className="w-44">Ajouter</SubmitButton>
            </div>
          </form>
        )}
        <Toaster expand={false} position="bottom-left" />
      </div>
    </>
  );
}
