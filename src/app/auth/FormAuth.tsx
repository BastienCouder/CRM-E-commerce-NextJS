"use client";

import { useCallback, useState } from "react";
import { signIn } from "next-auth/react";
import styles from "@/styles/Button.module.css";
import Input from "@/components/Input";
import { AiFillFacebook, AiFillGoogleSquare } from "react-icons/ai";
import { useRouter } from "next/navigation";
import ShowPassword from "./ShowPassword";

interface FormAuthProps {
  registerForm: (formData: FormData) => Promise<void>;
}

export default function FormAuth({ registerForm }: FormAuthProps) {
  const router = useRouter();
  const [email, setEmail] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const [variant, setVariant] = useState("login");

  const toggleVariant: () => void = useCallback(() => {
    setVariant((currentVariant) =>
      currentVariant === "login" ? "register" : "login"
    );
    setError("");
  }, []);
  const login = useCallback(async () => {
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
  }, [email, password, router]);

  const register: () => void = useCallback(async () => {
    try {
      const form = new FormData();
      form.append("name", name);
      form.append("email", email);
      form.append("password", password);

      await registerForm(form);
      login();
    } catch (error: any) {
      console.error("An error occurred during registration:", error);
      if (error instanceof Error) {
        setError(error.message);
      }
    }
  }, [email, name, password, registerForm, login]);

  return (
    <>
      <div className="w-full h-full flex flex-col justify-center items-center space-y-8">
        <h2 className="text-4xl">
          {variant === "login" ? "Se connecter" : "S'inscrire"}
        </h2>
        <div className="bg-zinc-800 w-full md:w-1/2 xl:w-1/3 p-8 flex flex-col items-center space-y-4">
          {error ? <small className="text-red-500">{error}</small> : null}
          <div className="w-full flex flex-col items-start space-y-8">
            {variant === "register" && (
              <Input
                required={true}
                id="name"
                type="text"
                label="Nom"
                value={name}
                onChange={(e: any) => setName(e.target.value)}
              />
            )}
            <Input
              required={true}
              id="email"
              type="email"
              label="Email"
              value={email}
              onChange={(e: any) => setEmail(e.target.value)}
            />
            <ShowPassword
              password={password}
              setPassword={setPassword}
              type="password"
              variant={variant}
            />
          </div>

          <div className="py-4">
            <button
              onClick={variant === "login" ? login : register}
              className={`${styles.button} py-3 px-5  relative uppercase tracking-[4px] flex items-center`}
            >
              <div className={styles.buttonLeft}></div>
              <div className={styles.buttonTopLeft}></div>
              <div className={styles.buttonBottomLeft}></div>
              <div className={styles.buttonRight}></div>
              <div className={styles.buttonTopRight}></div>
              <div className={styles.buttonBottomRight}></div>
              {variant === "login" ? "Se connecter" : "S'inscrire"}
            </button>
          </div>
          <div className="w-full flex items-center">
            <div className="w-1/2 h-px bg-white"></div>
            <p className="px-8 flex justify-center items-center">Ou</p>
            <div className="w-1/2 h-px bg-white"></div>
          </div>
          <div className="flex space-x-8 items-center cursor-pointer ">
            <div onClick={() => signIn("google", { callbackUrl: "/" })}>
              <AiFillGoogleSquare size={34} />
            </div>
            <div onClick={() => signIn("github", { callbackUrl: "/" })}>
              <AiFillFacebook size={34} />
            </div>
          </div>
          <p>
            {variant === "login" ? "Première fois ? " : "Déjà un compte ? "}
            <span
              onClick={toggleVariant}
              className="cursor-pointer hover:border-b-2 "
            >
              {variant === "login" ? "Créer un compte" : "Se connecter"}
            </span>
          </p>
        </div>
      </div>
    </>
  );
}
