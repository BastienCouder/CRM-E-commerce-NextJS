import LoginForm from "@/components/auth/form-login";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { env } from "@/lib/env";
import { Metadata } from "next";
import Link from "next/link";
import { getDictionary } from "@/app/lang/dictionaries";
import urls from "@/data/url";

export async function generateMetadata({
  params: { lang },
}: LoginProps): Promise<Metadata> {
  const dict = await getDictionary(lang);

  return {
    title: `${dict.metadata.login_title} - ${env.NAME_WEBSITE}`,
    description: `${dict.metadata.login_metadescription}`,
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
      </div>
    </div>
  );
}
