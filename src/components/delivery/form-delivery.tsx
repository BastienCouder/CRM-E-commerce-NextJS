"use client";
import { useCallback, useState } from "react";
import { Session } from "next-auth";

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
import { toast } from "sonner";
import {
  DeliverySchema,
  DeliveryValues,
  defaultDeliveryValues,
} from "@/lib/zod";
import { DeliveryOption } from "@prisma/client";

interface FormDeliveryProps {
  processDeliveryForm: any;
  session: Session | null;
}

export default function FormDelivery({
  processDeliveryForm,
  session,
}: FormDeliveryProps) {
  const form = useForm<DeliveryValues>({
    resolver: zodResolver(DeliverySchema),
    defaultValues: defaultDeliveryValues,
  });

  const [formVisible, setFormVisible] = useState(false);
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

  const [selectedDeliveryOption, setSelectedDeliveryOption] =
    useState<DeliveryOption | null>(null);

  const onSubmit = async (data: DeliveryValues) => {
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
      await processDeliveryForm(formData, selectedDeliveryOption!);
      toast.success("Addresse de livraison ajoutée avec succès");
      form.reset();
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      }
    }
  };

  return (
    <>
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
          <div className="pt-4">
            <Button aria-label="ajouter" type="submit">
              Ajouter
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
}