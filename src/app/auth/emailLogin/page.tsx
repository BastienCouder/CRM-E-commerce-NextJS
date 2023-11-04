import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function sendEmailLogin() {
  return (
    <div className="w-screen h-screen px-4 flex justify-center items-center">
      <div className="flex flex-col justify-center items-center space-y-8">
        <h1 className="text-3xl">Confirmer l'email</h1>
        <div className="space-y-4 text-sm md:text-base">
          <p className="text-center">
            Merci de confirmer votre email pour vous connecter
          </p>
          <p className="text-center">Un mail de connexion vous a été envoyé</p>
          <Link href="mailto:" className="flex justify-center">
            <Button size="xl">Confirmer l'email</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
