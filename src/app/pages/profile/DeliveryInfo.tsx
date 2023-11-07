"use client";
import { DeliveryProps } from "@/lib/db/delivery";
import { Session } from "next-auth";
import { useCallback, useEffect, useId, useState } from "react";
import { Toaster, toast } from "sonner";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { DeliverySchema, DeliveryValues } from "@/lib/zod";

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

  const deliveryItem = delivery?.deliveryItems.find(
    (item) => item.id === selectedDeliveryItem
  );

  const form = useForm<DeliveryValues>({
    resolver: zodResolver(DeliverySchema),
    defaultValues: {
      name: deliveryItem?.name || "",
      surname: deliveryItem?.surname || "",
      email: deliveryItem?.email || "",
      address: deliveryItem?.address || "",
      postcode: deliveryItem?.postcode || "",
      city: deliveryItem?.city || "",
      country: deliveryItem?.country || "France",
      tel: deliveryItem?.tel || "",
    },
  });
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

  const [formVisible, setFormVisible] = useState(false);

  const toggleFormVisibility = useCallback(async () => {
    setFormVisible(!formVisible);
  }, [formVisible]);

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

  const onSubmit = useCallback(
    async (data: DeliveryValues) => {
      if (!session || !session.user) {
        setError("Veuillez vous connecter");
        return;
      }

      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("surname", data.surname);
      formData.append("email", data.email);
      formData.append("address", data.address);
      formData.append("country", data.country);
      formData.append("postcode", data.postcode);
      formData.append("city", data.city);
      formData.append("tel", data.tel);

      try {
        if (deliveryItem?.id) {
          await UpdateDeliveryForm(deliveryItem.id, formData);
        }
        toggleFormVisibility();
        toast.success("Addresse de livraison ajoutée avec succès");
        form.reset();
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        }
      }
    },
    [UpdateDeliveryForm, deliveryItem?.id, session, form, toggleFormVisibility]
  );

  useEffect(() => {
    setSelectedDeliveryItem(
      delivery?.deliveryItems.find((item) => item.Default)?.id
    );
  }, [delivery]);

  return (
    <div className="space-y-4">
      <ul className="space-y-4 w-[35rem]">
        {delivery?.deliveryItems &&
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
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full space-y-4"
          >
            {error ? <small className="text-red-500">{error}</small> : null}
            <div className="w-full flex flex-col sm:flex-row gap-6 sm:gap-12">
              {/* name */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Prenom</FormLabel>
                    <FormControl>
                      <Input placeholder="prenom" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* surname */}
              <FormField
                control={form.control}
                name="surname"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Nom</FormLabel>
                    <FormControl>
                      <Input placeholder="nom" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            {/* email*/}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/*tel*/}
            <FormField
              control={form.control}
              name="tel"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Téléphone</FormLabel>
                  <FormControl>
                    <Input placeholder="tel" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* address*/}
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Adresse</FormLabel>
                  <FormControl>
                    <Input placeholder="adresse" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* country*/}
            <FormField
              control={form.control}
              name="country"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Pays</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Pays" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {countries.map((country, index) => (
                        <SelectItem key={index} value={country}>
                          {country}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* postcode*/}
            <FormField
              control={form.control}
              name="postcode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Code Postal</FormLabel>
                  <FormControl>
                    <Input placeholder="code postal" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* city*/}
            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ville</FormLabel>
                  <FormControl>
                    <Input placeholder="ville" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button>Modifier</Button>
          </form>
        </Form>
      )}
    </div>
  );
}
