import RegisterForm from "@/components/auth/form-register";
import { Metadata } from "next";
import { getDictionary } from "@/lang/dictionaries";
import { env } from "@/lib/env";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import routes from "@/lib/data/routes.json";
import Link from "next/link";

export async function generateMetadata({
  params: { lang },
}: RegisterProps): Promise<Metadata> {
  const dict = await getDictionary(lang);

  return {
    title: `${dict.metadata.register_title} - ${env.NAME_WEBSITE}`,
    description: `${dict.metadata.register_metadescription}`,
  };
}

interface RegisterProps {
  params: {
    lang: string;
  };
}

export default async function Register({ params: { lang } }: RegisterProps) {
  const dict = await getDictionary(lang);

  return (
    <>
      <div className="lg:p-8">
        <Link
          href={routes.login}
          className={cn(
            buttonVariants(),
            "absolute top-[1.5rem] hover:bg-muted"
          )}
        >
          {dict.auth.login}
        </Link>
        <div className="relative mx-auto flex w-full flex-col justify-center space-y-4 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              {dict.auth.register}
            </h1>
          </div>
          <RegisterForm dict={dict} />
        </div>
      </div>
    </>
  );
}
