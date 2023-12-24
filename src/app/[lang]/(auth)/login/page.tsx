import LoginForm from "@/components/LoginForm";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/helpers/utils";
import { env } from "@/lib/env";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getDictionary } from "@/app/[lang]/dictionaries/dictionaries";
import urls from "@/lib/data/url";

export async function generateMetadata({
  params: { lang },
}: LoginProps): Promise<Metadata> {
  const dict = await getDictionary(lang);

  return {
    title: `${dict.metadata.login_title} - ${env.NAME_WEBSITE}`,
    description: `${dict.metadata.login_metadescritpion}`,
  };
}

interface LoginProps {
  params: {
    lang: string;
  };
}

export default async function Login({ params: { lang } }: LoginProps) {
  const dict = await getDictionary(lang);

  return (
    <>
      <section className="h-screen">
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
              href={urls.register}
              className={cn(
                buttonVariants({ variant: "outline" }),
                "absolute top-[1.5rem] hover:bg-muted"
              )}
            >
              {dict.auth.register}
            </Link>
            <div className="relative mx-auto flex w-full flex-col justify-center space-y-4 sm:w-[350px]">
              <div className="flex flex-col space-y-2 text-center">
                <h1 className="text-2xl font-semibold tracking-tight">
                  {dict.auth.login}
                </h1>
              </div>
              <LoginForm dict={dict} />
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
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
