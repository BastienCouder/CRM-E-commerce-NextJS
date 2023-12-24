"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  RegisterSchema,
  RegisterValues,
  defaultRegisterValues,
} from "@/lib/zod";
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
import ShowPassword from "@/components/ShowPassword";
import { Separator } from "@/components/ui/separator";
import { signIn } from "next-auth/react";
import { AiFillGoogleSquare } from "react-icons/ai";
import { registerForm } from "@/app/[lang]/(auth)/action";
import { Dictionary } from "@/app/[lang]/dictionaries/dictionaries";

interface RegisterFormProps {
  dict: Dictionary;
}

export default function RegisterForm({ dict }: RegisterFormProps) {
  const form = useForm<RegisterValues>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: defaultRegisterValues,
  });

  const register = async () => {
    const formData = new FormData();
    formData.append("username", form.getValues("username"));
    formData.append("email", form.getValues("email"));
    formData.append("password", form.getValues("password"));
    await registerForm(formData);
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
        {dict.auth.enter_email_register}
      </p>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(register)}
          className="w-full flex flex-col justify-center items-center space-y-4"
        >
          {/* name */}
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>{dict.form.name}</FormLabel>
                <FormControl>
                  <Input placeholder={dict.form.name} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
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

                <FormMessage />
              </FormItem>
            )}
          />
          <Button aria-label={dict.auth.register} size="lg">
            {dict.auth.register}
          </Button>
        </form>
      </Form>
    </>
  );
}
