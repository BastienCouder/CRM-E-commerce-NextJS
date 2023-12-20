"use client";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginSchema, LoginValues, defaultLoginValues } from "@/lib/zod";
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
import Link from "next/link";
import ShowPassword from "@/components/ShowPassword";
import { checkPassword } from "@/helpers/authHelper";
import { toast } from "sonner";
import { AiFillGoogleSquare } from "react-icons/ai";
import { Separator } from "@/components/ui/separator";

export default function LoginForm() {
  const router = useRouter();
  const form = useForm<LoginValues>({
    resolver: zodResolver(LoginSchema),
    defaultValues: defaultLoginValues,
  });

  const login = async () => {
    const email = form.getValues("email");
    const password = form.getValues("password");
    try {
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
          router.push("/profile");
        }
      }
    } catch (error) {
      console.error("Une erreur s'est produite lors de la connexion : ", error);
      throw error;
    }
  };

  return (
    <>
      <Separator />
      <div className="space-y-4">
        <div className="flex items-center justify-center cursor-pointer">
          <div
            onClick={() => signIn("google", { callbackUrl: "/" })}
            className="w-full flex items-center justify-center gap-x-2 cursor-pointer px-4 py-2 bg-card hover:bg-muted rounded-lg"
          >
            Google
            <AiFillGoogleSquare size={34} />
          </div>
        </div>
        <div className="w-full flex items-center">
          <div className="w-1/2 h-px bg-white"></div>
          <p className="px-8 flex justify-center items-center">Ou</p>
          <div className="w-1/2 h-px bg-white"></div>
        </div>
      </div>
      <p className="text-sm mx-auto text-center text-muted-foreground">
        Saisissez votre email ci-dessous pour vous connecter
      </p>
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
                  <small>
                    <Link
                      href="forgotPassword"
                      className="cursor-pointer hover:text-secondary"
                    >
                      Mot de passe oublié ?
                    </Link>
                  </small>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />
          <Button aria-label="connexion" size="lg">
            Se connecter
          </Button>
        </form>
      </Form>
    </>
  );
}
