"use client";
import { useRouter } from "next/navigation";
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
import { LoginSchema, LoginValues, defaultLoginValues } from "@/lib/zod";

import { toast } from "sonner";
import Link from "next/link";
import { Session } from "next-auth";
import { useCallback } from "react";
import { signIn } from "next-auth/react";
import { checkPassword } from "@/app/auth/action";
import ShowPassword from "@/components/ShowPassword";
import { AiFillGoogleSquare } from "react-icons/ai";

interface FormDeliveryProps {
  session: Session | null;
}

export default function FormLogin({ session }: FormDeliveryProps) {
  const router = useRouter();

  const formResolver = zodResolver(LoginSchema);
  const form = useForm<LoginValues>({
    resolver: formResolver,
    defaultValues: defaultLoginValues,
  });

  const login = useCallback(async () => {
    try {
      const email = form.getValues("email");
      const password = form.getValues("password");

      await signIn("email", {
        email: email,
        password: password,
        redirect: false,
      });

      const isCorrectPassword = await checkPassword({ email, password });

      if (password) {
        if (!isCorrectPassword) {
          toast.error("Le mot de passe est incorrecte");
        } else {
          router.push("/auth/emailLogin");
        }
      }
    } catch (error) {
      console.error("Une erreur s'est produite lors de la connexion : ", error);
      throw error;
    }
  }, [form, router]);

  return (
    <>
      <div className="px-4 md:px-20 xl:p-0 space-y-8 ">
        {!session?.user ? (
          <>
            <h1 className="text-4xl text-center md:text-start">Connexion</h1>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(login)}
                className="w-full flex flex-col justify-center items-center space-y-4"
              >
                {/* email */}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="email" {...field} />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* password */}
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <ShowPassword
                          password={field.value}
                          setPassword={field.onChange}
                        />
                      </FormControl>

                      <div className="flex flex-col">
                        <Link
                          href="/auth/forgotPassword"
                          className="cursor-pointer"
                        >
                          <small>Mot de passe oublié ?</small>
                        </Link>
                        <FormMessage />
                      </div>
                    </FormItem>
                  )}
                />
                <div className="py-4">
                  <Button size="lg">Se connecter</Button>
                </div>
                <div className="w-full flex items-center">
                  <div className="w-1/2 h-px bg-white"></div>
                  <p className="px-8 flex justify-center items-center">Ou</p>
                  <div className="w-1/2 h-px bg-white"></div>
                </div>
                <div className="flex space-x-8 items-center cursor-pointer ">
                  <div
                    onClick={() => signIn("google", { callbackUrl: "/" })}
                    className="flex items-center gap-x-2 cursor-pointer px-4 py-2 border-2 border-white"
                  >
                    Google
                    <AiFillGoogleSquare size={34} />
                  </div>
                </div>
              </form>
            </Form>
          </>
        ) : null}
      </div>
    </>
  );
}
