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
import ShowPassword from "@/components/ShowPassword";
import {
  AccountFormValues,
  AccountFormSchema,
  PasswordFormSchema,
  PasswordFormValues,
  defaultPasswordValues,
} from "@/lib/zod";
import { Session } from "next-auth";
import updateUser, { updatePassword } from "./action";
import { Separator } from "@/components/ui/separator";

interface UserInfoProps {
  session: Session | null;
}

export default function UserInfo({ session }: UserInfoProps) {
  const [error, setError] = useState<string | null>(null);
  const formProfile = useForm<AccountFormValues>({
    resolver: zodResolver(AccountFormSchema),
    defaultValues: {
      surname: session?.user.name || "",
      email: session?.user.email || "",
    },
  });

  const formPassword = useForm<PasswordFormValues>({
    resolver: zodResolver(PasswordFormSchema),
    defaultValues: defaultPasswordValues,
  });

  const onSubmitProfile = useCallback(
    async (data: AccountFormValues) => {
      const formData = new FormData();

      formData.append("surname", data.surname);
      formData.append("email", data.email);

      try {
        await updateUser(formData);
        toast.success("Profile modifiée avec succès");
        formProfile.reset();
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        }
      }
    },
    [formProfile]
  );

  const onSubmitPassword = useCallback(
    async (data: PasswordFormValues) => {
      const formData = new FormData();
      formData.append("password", data.password);

      try {
        await updatePassword(formData);
        toast.success("Mot de passe modifiée avec succès");
        formPassword.reset();
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        }
      }
    },
    [formPassword]
  );

  return (
    <div className="space-y-12">
      <Form {...formProfile}>
        <form
          onSubmit={formProfile.handleSubmit(onSubmitProfile)}
          className="w-full space-y-6"
        >
          {error ? <small className="text-red-500">{error}</small> : null}

          {/* surname */}
          <FormField
            control={formProfile.control}
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
            control={formProfile.control}
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

      <Form {...formPassword}>
        <form
          onSubmit={formPassword.handleSubmit(onSubmitPassword)}
          className="w-full space-y-6"
        >
          {error ? <small className="text-red-500">{error}</small> : null}

          {/* password */}
          <FormField
            control={formPassword.control}
            name="password"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Nouveau mot de passe</FormLabel>
                <FormControl>
                  <ShowPassword
                    password={field.value}
                    setPassword={field.onChange}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <Button size="xl">Modifier le mot de passe</Button>
        </form>
      </Form>
    </div>
  );
}
