import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

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
import { toast } from "sonner";
import { useCallback, useEffect, useState } from "react";

import { AccountFormValues, AccountFormSchema } from "@/lib/zod";
import { Session } from "next-auth";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { updateUser } from "./action";

interface UserInfoProps {
  session: Session | null;
}

export default function UserInfo({ session }: UserInfoProps) {
  const [error, setError] = useState<string | null>(null);

  const form = useForm<AccountFormValues>({
    resolver: zodResolver(AccountFormSchema),
    defaultValues: {
      surname: session?.user.name || "",
      email: session?.user.email || "",
    },
  });

  useEffect(() => {
    form.setValue("surname", session?.user.name || "");
    form.setValue("email", session?.user.email || "");
  }, [session, form]);

  const onSubmit = useCallback(async (data: AccountFormValues) => {
    const formData = new FormData();

    formData.append("surname", data.surname);
    formData.append("email", data.email);

    try {
      await updateUser(formData);
      toast.success("Profil modifié avec succès");
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      }
    }
  }, []);

  return (
    <div className="space-y-8">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full space-y-6"
        >
          {error ? <small className="text-red-500">{error}</small> : null}

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

          <Button aria-label="modifier le profil" size="xl">
            Modifier le profil
          </Button>
        </form>
      </Form>
      <Separator />
      <div className="space-y-4">
        <h2 className="text-2xl">Mot de passe :</h2>
        <div>
          <Link href="/auth/forgotPassword">
            <Button aria-label="modifier le mot de passe" size="xl">
              Modifier le mot de passe
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
