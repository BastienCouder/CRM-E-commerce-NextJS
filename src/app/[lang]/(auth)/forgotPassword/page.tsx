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
import { sendForgotPassword } from "./action";
import { useRouter } from "next/navigation";
import { checkIfEmailExists } from "@/helpers/authHelper";

//ForgotPassword zod schema
const ForgotPasswordSchema = z.object({
  email: z
    .string({
      required_error: "Un email est requis",
      invalid_type_error: "L'email doit être une chaîne de caractères",
    })
    .email({
      message: "Adresse e-mail invalide",
    })
    .refine(
      async (email) => {
        const existingUser = await checkIfEmailExists(email);
        return existingUser;
      },
      {
        message: "L'e-mail n'existe pas",
      }
    ),
});

type ForgotPasswordValues = z.infer<typeof ForgotPasswordSchema>;
const defaultForgotPasswordValues: Partial<ForgotPasswordValues> = {};

export default function ForgotPassword() {
  const router = useRouter();
  const formResolver = zodResolver(ForgotPasswordSchema);

  const form = useForm<ForgotPasswordValues>({
    resolver: formResolver,
    defaultValues: defaultForgotPasswordValues,
  });

  const onSubmit = async (data: ForgotPasswordValues) => {
    try {
      const formData = new FormData();
      formData.append("email", data.email);

      try {
        await sendForgotPassword(formData);
        toast.success(
          "E-mail de réinitialisation de mot de passe envoyé avec succès"
        );
        form.reset();
        router.push("/auth");
      } catch (error) {
        if (error instanceof Error) {
          toast.error("Une erreur s'est produite");
        }
      }
    } catch (error) {
      console.error("Une erreur s'est produite lors de la connexion : ", error);
      throw error;
    }
  };

  return (
    <div className="w-full h-screen flex flex-col justify-center items-center space-y-10">
      <div className="flex flex-col items-center space-y-8">
        <h2 className="text-3xl">Réinitialiser le mot de passe</h2>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full flex flex-col justify-center items-center space-y-4"
          >
            {/* email */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel> Entrez votre adresse e-mail :</FormLabel>
                  <FormControl>
                    <Input placeholder="email" {...field} />
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
