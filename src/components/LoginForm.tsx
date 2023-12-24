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
import { Dictionary } from "@/app/[lang]/dictionaries/dictionaries";
import urls from "@/lib/data/url";

interface LoginFormProps {
  dict: Dictionary;
}

export default function LoginForm({ dict }: LoginFormProps) {
  const router = useRouter();
  const form = useForm<LoginValues>({
    resolver: zodResolver(LoginSchema),
    defaultValues: defaultLoginValues,
  });

  const login = async () => {
    const email = form.getValues("email");
    const password = form.getValues("password");
    try {
      await signIn("credentials", {
        email: email,
        password: password,
        redirect: false,
      });

      const isCorrectPassword = await checkPassword(email, password);

      if (password) {
        if (!isCorrectPassword) {
          toast.error(`${dict.auth.incorrect_password}`);
        } else {
          router.push(`${urls.profile}`);
        }
      }
    } catch (error: any) {
      throw new Error(`${dict.auth.error_login} ${error.message}`);
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
          <p className="px-8 flex justify-center items-center">
            {dict.pronouns.or}
          </p>
          <div className="w-1/2 h-px bg-white"></div>
        </div>
      </div>
      <p className="text-sm mx-auto text-center text-muted-foreground first-letter:uppercase">
        {dict.auth.enter_email_login}
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
                <FormLabel>{dict.form.email}</FormLabel>
                <FormControl>
                  <Input placeholder={dict.form.email} {...field} />
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
                <FormLabel>{dict.form.password}</FormLabel>
                <FormControl>
                  <ShowPassword
                    password={field.value}
                    setPassword={field.onChange}
                    dict={dict}
                  />
                </FormControl>
                <div className="flex flex-col">
                  <small>
                    <Link
                      href={urls.forgot_password}
                      className="cursor-pointer hover:text-secondary"
                    >
                      {dict.form.forgot_password} ?
                    </Link>
                  </small>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />
          <Button aria-label={dict.auth.login} size="lg">
            {dict.auth.login}
          </Button>
        </form>
      </Form>
    </>
  );
}
