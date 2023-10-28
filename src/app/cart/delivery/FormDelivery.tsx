"use client";
import Input from "@/components/Input";
import { useId, useState } from "react";
import formStyles from "@/styles/FormDelivery.module.css";
import buttonStyles from "@/styles/Button.module.css";
import { Session } from "next-auth";
import ShowPassword from "@/app/auth/ShowPassword";
import { signIn } from "next-auth/react";
import { AiFillGoogleSquare } from "react-icons/ai";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface FormDeliveryProps {
  deliveryForm: (formData: FormData) => Promise<void>;
  session: Session | null;
}

export default function FormDelivery({
  deliveryForm,
  session,
}: FormDeliveryProps) {
  const emailId = useId();
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    email: "",
    address: "",
    postcode: "",
    city: "",
    country: "France",
    tel: "",
  });
  const [loginData, setLoginData] = useState({
    emailLogin: "",
    password: "",
  });
  const [errorLogin, setErrorLogin] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const countries = [
    "Allemagne",
    "Belgique",
    "Espagne",
    "France",
    "Irlande",
    "Italie",
    "Luxembourg",
    "Malte",
    "Portugal",
    "Roumanie",
    "Royaume-uni",
  ];

  const { name, surname, email, address, postcode, city, country, tel } =
    formData;
  const { emailLogin, password } = loginData;

  const handleDeliveryChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleLoginChange = (name: string, value: string) => {
    setLoginData({ ...loginData, [name]: value });
  };

  const handlelogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const result = await signIn("credentials", {
        email: emailLogin,
        password,
        redirect: false,
      });

      if (result?.error) {
        setErrorLogin(result.error);
      } else {
        router.push("/");
      }
    } catch (error) {
      if (error instanceof Error) {
        setErrorLogin(error.message);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!session || !session.user) {
      setError("Veuillez vous connecter");
      return;
    }

    const form = new FormData();
    form.append("name", name);
    form.append("surname", surname);
    form.append("email", email);
    form.append("address", address);
    form.append("country", country);
    form.append("postcode", postcode);
    form.append("city", city);
    form.append("tel", tel);

    try {
      await deliveryForm(form);
      router.push("/cart/payment");
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      }
    }
  };

  return (
    <>
      {!session?.user ? (
        <>
          <h1 className="text-4xl text-center lg:text-start">Connexion</h1>
          <form
            onSubmit={handlelogin}
            className="w-full sm:w-[35rem] md:w-[45rem] space-y-6"
          >
            {errorLogin ? (
              <small className="text-red-500">{errorLogin}</small>
            ) : null}
            <div className="flex flex-col sm:flex-row gap-6 sm:gap-12">
              <Input
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
                className="flex items-center gap-x-2 cursor-pointer"
              >
                Google
                <AiFillGoogleSquare size={34} />
              </div>
            </div>
            <div className="flex gap-x-8 pt-4">
              <button
                type="submit"
                className={`${buttonStyles.button} py-3 px-5 w-44 justify-center relative uppercase tracking-[4px] flex items-center`}
              >
                <div className={buttonStyles.buttonLeft}></div>
                <div className={buttonStyles.buttonTopLeft}></div>
                <div className={buttonStyles.buttonBottomLeft}></div>
                <div className={buttonStyles.buttonTop}></div>
                <div className={buttonStyles.buttonBottom}></div>
                <div className={buttonStyles.buttonRight}></div>
                <div className={buttonStyles.buttonTopRight}></div>
                <div className={buttonStyles.buttonBottomRight}></div>
                Valider
              </button>
              <Link href="/auth">
                <button
                  className={`${buttonStyles.button} py-3 px-5 w-44 justify-center relative uppercase tracking-[4px] flex items-center`}
                >
                  <div className={buttonStyles.buttonLeft}></div>
                  <div className={buttonStyles.buttonTopLeft}></div>
                  <div className={buttonStyles.buttonBottomLeft}></div>
                  <div className={buttonStyles.buttonTop}></div>
                  <div className={buttonStyles.buttonBottom}></div>
                  <div className={buttonStyles.buttonRight}></div>
                  <div className={buttonStyles.buttonTopRight}></div>
                  <div className={buttonStyles.buttonBottomRight}></div>
                  S&apos;inscrire
                </button>
              </Link>
            </div>
          </form>
        </>
      ) : null}
      <h1 className="text-4xl text-center lg:text-start">Livraison</h1>
      <form
        onSubmit={handleSubmit}
        className="w-full sm:w-[35rem] md:w-[45rem] space-y-6"
      >
        {error ? <small className="text-red-500">{error}</small> : null}
        <div className="flex flex-col sm:flex-row gap-6 sm:gap-12">
          <Input
            required={true}
            id="name"
            type="text"
            label="Prénom"
            name="name"
            value={name}
            onChange={handleDeliveryChange}
          />
          <Input
            required={true}
            id="surname"
            type="text"
            label="Nom"
            name="surname"
            value={surname}
            onChange={handleDeliveryChange}
          />
        </div>
        <div className="flex flex-col sm:flex-row gap-6 sm:gap-12">
          <Input
            required={true}
            id={emailId}
            type="email"
            label="Email"
            name="email"
            value={email}
            onChange={handleDeliveryChange}
          />
          <Input
            required={true}
            id="tel"
            type="tel"
            label="Téléphone"
            name="tel"
            value={tel}
            onChange={handleDeliveryChange}
          />
        </div>
        <select
          id="country"
          name="country"
          value={country}
          onChange={handleDeliveryChange}
          className={`${formStyles.select} bg-zinc-800 px-4 py-2`}
        >
          {countries.map((country, index) => (
            <option key={index} value={country} className={` bg-zinc-800`}>
              {country}
            </option>
          ))}
        </select>
        <Input
          required={true}
          id="address"
          type="text"
          label="Adresse"
          name="address"
          value={address}
          onChange={handleDeliveryChange}
        />
        <Input
          required={true}
          id="postcode"
          type="text"
          label="Code postal"
          name="postcode"
          value={postcode}
          onChange={handleDeliveryChange}
        />
        <Input
          required={true}
          id="city"
          type="text"
          label="Ville"
          name="city"
          value={city}
          onChange={handleDeliveryChange}
        />
        <div className="pt-4">
          <button
            type="submit"
            className={`${buttonStyles.button} py-3 px-5 w-44 justify-center relative uppercase tracking-[4px] flex items-center`}
          >
            <div className={buttonStyles.buttonLeft}></div>
            <div className={buttonStyles.buttonTopLeft}></div>
            <div className={buttonStyles.buttonBottomLeft}></div>
            <div className={buttonStyles.buttonTop}></div>
            <div className={buttonStyles.buttonBottom}></div>
            <div className={buttonStyles.buttonRight}></div>
            <div className={buttonStyles.buttonTopRight}></div>
            <div className={buttonStyles.buttonBottomRight}></div>
            Valider
          </button>
        </div>
      </form>
    </>
  );
}
