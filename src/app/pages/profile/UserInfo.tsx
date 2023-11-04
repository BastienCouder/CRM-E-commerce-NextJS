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
import { useCallback, useState } from "react";

import { AccountFormValues, AccountFormSchema } from "@/lib/zod";
import { Session } from "next-auth";
import updateUser from "./action";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";

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

  const onSubmit = useCallback(
    async (data: AccountFormValues) => {
      const formData = new FormData();

      formData.append("surname", data.surname);
      formData.append("email", data.email);

      try {
        await updateUser(formData);
        toast.success("Profile modifiée avec succès");
        form.reset();
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        }
      }
    },
    [form]
  );

  return (
    <div className="space-y-12">
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

          <Button size="xl">Modifier le profil</Button>
        </form>
      </Form>
      <Separator />
      <Link href="/profile/resetPassword">
        <Button size="xl">Modifier le mot de passe</Button>
      </Link>
    </div>
  );
}
