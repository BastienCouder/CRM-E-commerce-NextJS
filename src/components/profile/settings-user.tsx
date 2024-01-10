"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useState, useTransition } from "react";
import { Separator } from "@/components/ui/separator";
import { settings } from "@/app/actions/auth/setting";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useSession } from "next-auth/react";
import { SettingsSchema } from "@/schemas";
import { z } from "zod";
import { FormError } from "../auth/form-error";
import { FormSuccess } from "../auth/form-success";
import { Switch } from "../ui/switch";
import { notFound } from "next/navigation";

export default function SettingsUser() {
  const user = useCurrentUser();
  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();
  const { update } = useSession();
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof SettingsSchema>>({
    resolver: zodResolver(SettingsSchema),
    defaultValues: {
      password: undefined,
      newPassword: undefined,
      name: user?.name || undefined,
      email: user?.email || undefined,
    },
  });

  const onSubmit = (values: z.infer<typeof SettingsSchema>) => {
    startTransition(() => {
      settings(values)
        .then((data) => {
          if (data.error) {
            setError(data.error);
          }

          if (data.success) {
            update();
            setSuccess(data.success);
          }
        })
        .catch(() => setError("Something went wrong!"));
    });
  };

  return (
    <section className="px-4 w-[40rem] space-y-4">
      <h2 className="text-2xl text-center md:text-start">Profil</h2>
      <Separator />

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full space-y-6"
        >
          {error ? <small className="text-red-500">{error}</small> : null}

          {/* surname */}
          <FormField
            control={form.control}
            name="name"
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
          {user?.isOAuth === false && (
            <>
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

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="******"
                        type="password"
                        disabled={isPending}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New Password</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="******"
                        type="password"
                        disabled={isPending}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="isTwoFactorEnabled"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                    <div className="space-y-0.5">
                      <FormLabel>Two Factor Authentication</FormLabel>
                      <FormDescription>
                        Enable two factor authentication for your account
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        disabled={isPending}
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </>
          )}
          <FormError message={error} />
          <FormSuccess message={success} />
          <Button
            variant={"client"}
            disabled={isPending}
            aria-label="modifier le profil"
          >
            Modifier le profil
          </Button>
        </form>
      </Form>
    </section>
  );
}
