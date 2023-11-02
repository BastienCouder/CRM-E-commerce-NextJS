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
import { toast } from "sonner";
import { useCallback, useState } from "react";
import ShowPassword from "@/components/ShowPassword";
import {
  PasswordFormSchema,
  PasswordFormValues,
  defaultPasswordValues,
} from "@/lib/zod";
import { updatePassword } from "../action";

export default function PasswordForm() {
  const [error, setError] = useState<string | null>(null);

  const form = useForm<PasswordFormValues>({
    resolver: zodResolver(PasswordFormSchema),
    defaultValues: defaultPasswordValues,
  });

  const onSubmit = useCallback(
    async (data: PasswordFormValues) => {
      const formData = new FormData();
      formData.append("password", data.password);

      try {
        await updatePassword(formData);
        toast.success("Mot de passe modifiée avec succès");
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

          {/* password */}
          <FormField
            control={form.control}
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
