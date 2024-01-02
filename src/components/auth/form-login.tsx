"use client";
import { signIn } from "next-auth/react";
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
import Link from "next/link";
import ShowPassword from "@/components/ShowPassword";
import { AiFillGoogleSquare } from "react-icons/ai";
import { Separator } from "@/components/ui/separator";
import { Dictionary } from "@/app/lang/dictionaries";
import urls from "@/data/url";
import { LoginSchema } from "@/schemas";
import { z } from "zod";
import { useState, useTransition } from "react";
import { login } from "@/actions/login";
import { useSearchParams } from "next/navigation";
import { FormError } from "./form-error";
import { FormSuccess } from "./form-success";

interface LoginFormProps {
  dict: Dictionary;
}

export default function LoginForm({ dict }: LoginFormProps) {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");
  const urlError =
    searchParams.get("error") === "OAuthAccountNotLinked"
      ? "Email already in use with different provider!"
      : "";

  const [showTwoFactor, setShowTwoFactor] = useState(false);
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (values: z.infer<typeof LoginSchema>) => {
    setError("");
    setSuccess("");

    startTransition(() => {
      login(values, callbackUrl)
        .then((data) => {
          if (data?.error) {
            form.reset();
            setError(data.error);
          }

          if (data?.success) {
            form.reset();
            setSuccess(data.success);
          }

          if (data?.twoFactor) {
            setShowTwoFactor(true);
          }
        })
        .catch(() => setError("Something went wrong"));
    });
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
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full flex flex-col justify-center items-center space-y-4"
        >
          {showTwoFactor && (
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Two Factor Code</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPending}
                      placeholder="123456"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          {!showTwoFactor && (
            <>
              {/* email */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>{dict.form.email}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={dict.form.email}
                        {...field}
                        disabled={isPending}
                      />
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
                        isPending={isPending}
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
            </>
          )}
          <FormError message={error || urlError} />
          <FormSuccess message={success} />
          <Button aria-label={dict.auth.login} size="lg">
            {showTwoFactor ? "Confirm" : `${dict.auth.login}`}
          </Button>
        </form>
      </Form>
      <p className="px-8 text-center text-sm text-muted-foreground first-letter:uppercase">
        {dict.auth.agree}{" "}
        <Link
          href={urls.legal}
          className="underline underline-offset-4 hover:text-secondary"
        >
          {dict.policy.terms_of_service}
        </Link>{" "}
        {dict.pronouns.and}{" "}
        <Link
          href={urls.privacy}
          className="underline underline-offset-4 hover:text-secondary"
        >
          {dict.policy.privacy_policy}
        </Link>
        .
      </p>
    </>
  );
}
