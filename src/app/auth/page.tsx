import { validateEmail } from "@/lib/utils";
import FormAuth from "./FormAuth";
import bcrypt from "bcrypt";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";

export default async function Auth() {
  const session = await getServerSession(authOptions);

  if (session) {
    redirect("/profile");
  }

  async function registerForm(formData: FormData) {
    "use server";
    const name = formData.get("name")?.toString();
    const email = formData.get("email")?.toString();
    const password = formData.get("password")?.toString();

    if (!name || !email || !password)
      throw Error("Nom, adresse e-mail et mot de passe requis");

    if (email && !validateEmail(email)) {
      throw Error("Email invalide");
    }

    if (password.length < 8) {
      throw Error("Le mot de passe doit contenir plus de 8 caractères.");
    }

    const existingUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (existingUser) {
      throw Error("L'email est déjà utilisé");
    }

    const hashedPassword = await bcrypt.hash(password!, 10);

    await prisma.user.create({
      data: { name, email, hashedPassword },
    });

    redirect("/profile");
  }

  return (
    <>
      <div className="h-screen w-screen">
        <FormAuth registerForm={registerForm} />
      </div>
    </>
  );
}
