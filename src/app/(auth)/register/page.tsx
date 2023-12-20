import LoginForm from "@/components/LoginForm";
import RegisterForm from "@/components/RegisterForm";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/helpers/utils";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Authentication",
  description: "Authentication forms built using the components.",
};

export default function RegisterPage() {
  return (
    <>
      <section className="h-screen">
        <div className="md:hidden">
          <Image
            src="/examples/authentication-light.png"
            width={1280}
            height={843}
            alt="Authentication"
            className="block dark:hidden"
          />
        </div>
        <div className="container relative hidden h-full flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
          <div className="relative hidden h-full flex-col px-8 py-2 text-foreground lg:flex">
            <div className="absolute inset-0 bg-[#000] " />
            <div className="relative z-20 flex items-center text-lg font-medium">
              <Image
                src="/svg/logo.svg"
                width={500}
                height={500}
                alt="logo"
                className="h-[140px] w-[140px]"
              />
            </div>
            <div className="relative z-20">
              <Image
                src="/images/watch3-2.jpg"
                width={500}
                height={500}
                alt="logo"
                className="h-[20rem] w-full object-cover"
              />
              <blockquote className="space-y-2 mt-10">
                <p className="text-lg">
                  &ldquo;This library has saved me countless hours of work and
                  helped me deliver stunning designs to my clients faster than
                  ever before.&rdquo;
                </p>
                <footer className="text-sm">Sofia Davis</footer>
              </blockquote>
            </div>
          </div>
          <div className="lg:p-8">
            <Link
              href="/login"
              className={cn(
                buttonVariants({ variant: "outline" }),
                "absolute top-[1.5rem] hover:bg-muted"
              )}
            >
              Se connecter
            </Link>
            <div className="relative mx-auto flex w-full flex-col justify-center space-y-4 sm:w-[350px]">
              <div className="flex flex-col space-y-2 text-center">
                <h1 className="text-2xl font-semibold tracking-tight">
                  S&apos;inscrire
                </h1>
              </div>

              <RegisterForm />
              <p className="px-8 text-center text-sm text-muted-foreground">
                By clicking continue, you agree to our{" "}
                <Link
                  href="/terms"
                  className="underline underline-offset-4 hover:text-secondary"
                >
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link
                  href="/privacy"
                  className="underline underline-offset-4 hover:text-secondary"
                >
                  Privacy Policy
                </Link>
                .
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
