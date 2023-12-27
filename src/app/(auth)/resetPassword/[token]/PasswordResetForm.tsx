"use client";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { ResetPassword } from "./action";

//ResetPassword zod schema
const ResetPasswordSchema = z.object({
  password: z.string({
    required_error: "Le mot de passe est requis",
    invalid_type_error: "Le mot de passe doit être une chaîne de caractères",
  }),
  passwordConfirmation: z.string({
    required_error: "La confirmation du mot de passe est requise",
    invalid_type_error:
      "La confirmation du mot de passe doit être une chaîne de caractères",
  }),
});

type PasswordResetValues = z.infer<typeof ResetPasswordSchema>;
const defaultPasswordValues: Partial<PasswordResetValues> = {};

interface PasswordResetProps {
  token: string;
}

export default function PasswordResetForm({ token }: PasswordResetProps) {
  const formResolver = zodResolver(ResetPasswordSchema);

  const form = useForm<PasswordResetValues>({
    resolver: formResolver,
    defaultValues: defaultPasswordValues,
  });

  const onSubmit = async (data: PasswordResetValues) => {
    const formData = new FormData();
    formData.append("password", data.password);
    formData.append("passwordConfirmation", data.passwordConfirmation);

    try {
      if (data.password === data.passwordConfirmation) {
        await ResetPassword(formData, token);
        toast.success("Mot de passe réinitialisé avec succès");
        form.reset();
      } else {
        toast.error("Les mots de passe ne correspondent pas");
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error("Une erreur s'est produite");
      }
    }
  };

  return (
    <div className="w-full h-screen flex flex-col justify-center items-center space-y-10">
      <div className="flex flex-col items-center space-y-8">
        <h2 className="text-3xl">Réinitialisation de mot de passe</h2>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full flex flex-col justify-center items-center space-y-4"
          >
            {/* Champ de mot de passe */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel> Nouveau mot de passe :</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Nouveau mot de passe"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Champ de confirmation de mot de passe */}
            <FormField
              control={form.control}
              name="passwordConfirmation"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel> Confirmation du mot de passe :</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Confirmez le mot de passe"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button aria-label="Réinitialiser le mot de passe" size="xl">
              Réinitialiser le mot de passe
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
