"use client";
import { useState, useTransition } from "react";

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
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { z } from "zod";
import { useSession } from "next-auth/react";
import { FormError } from "../auth/form-error";
import { FormSuccess } from "../auth/form-success";
import { DeliveryFormSchema } from "@/schemas";
import { useForm } from "react-hook-form";
import { processDeliveryForm } from "@/app/actions/pages/process-delivery-form";

export default function FormDelivery() {
  const session = useCurrentUser();

  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();
  const { update } = useSession();
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof DeliveryFormSchema>>({
    resolver: zodResolver(DeliveryFormSchema),
    defaultValues: {
      name: undefined,
      email: session?.email || undefined,
      city: undefined,
      postcode: undefined,
      country: undefined,
      tel: undefined,
    },
  });

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
  const onSubmit = (values: z.infer<typeof DeliveryFormSchema>) => {
    if (session) {
      startTransition(() => {
        processDeliveryForm(values)
          .then((data) => {
            if (data.error) {
              setError(data.error);
            } else if (data.success) {
              update();
              form.reset();
              setSuccess(data.success);
            }
          })
          .catch(() => setError("Something went wrong!"));
      });
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
                    <SelectTrigger className="bg-foreground text-background">
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
          <FormError message={error} />
          <FormSuccess message={success} />
          <div className="pt-4">
            <Button
              variant={"client"}
              disabled={isPending}
              aria-label="ajouter"
              type="submit"
            >
              Ajouter
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
}
