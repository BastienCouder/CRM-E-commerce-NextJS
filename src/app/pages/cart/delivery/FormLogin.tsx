"use client";
import Input from "@/components/Input";
import { useId, useState } from "react";
import { Session } from "next-auth";
import ShowPassword from "@/components/ShowPassword";
import { signIn } from "next-auth/react";
import { AiFillGoogleSquare } from "react-icons/ai";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface FormDeliveryProps {
  session: Session | null;
}

export default function FormLogin({ session }: FormDeliveryProps) {
  const emailId: string = useId();
  const router = useRouter();
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState<string | null>(null);

  const { email, password } = loginData;

  const handleLoginChange = (name: string, value: string) => {
    setLoginData({ ...loginData, [name]: value });
  };

  const handlelogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError(result.error);
      } else {
        router.push("/");
      }
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      }
    }
  };

  return (
    <>
      <div className="px-4 md:px-20 xl:p-0 space-y-8 ">
        {!session?.user ? (
          <>
            <h1 className="text-4xl text-center md:text-start">Connexion</h1>
            <form
              onSubmit={handlelogin}
              className="w-full  md:w-[30rem] space-y-6"
            >
              {error ? <small className="text-red-500">{error}</small> : null}
              <div className="flex flex-col sm:flex-row gap-6 sm:gap-12">
                <Input
                  autoComplete={false}
                  required={true}
                  id={emailId}
                  type="email"
                  label="Email"
                  name="email"
                  value={email}
                  onChange={(e) => handleLoginChange("email", e.target.value)}
                />
              </div>
              <div className="flex flex-col sm:flex-row gap-6 sm:gap-12">
                <ShowPassword
                  password={password}
                  setPassword={(value) => handleLoginChange("password", value)}
                  type="password"
                />
              </div>
              <div className="flex space-x-8 items-center">
                <div
                  onClick={() =>
                    signIn("google", { callbackUrl: "/cart/delivery" })
                  }
                  className="flex items-center gap-x-2 cursor-pointer px-4 py-2 border-2 border-white"
                >
                  Google
                  <AiFillGoogleSquare size={34} />
                </div>
              </div>
              <div className="flex gap-x-8 pt-4">
                <Button>Valider</Button>
                <Link href="/auth">
                  <Button>S&apos;inscrire</Button>
                </Link>
              </div>
            </form>
          </>
        ) : null}
      </div>
    </>
  );
}
