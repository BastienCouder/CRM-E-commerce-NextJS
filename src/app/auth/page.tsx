import FormAuth from "./FormAuth";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { registerForm } from "./action";

export default async function Auth() {
  const session = await getServerSession(authOptions);

  if (session) {
    redirect("/profile");
  }

  return (
    <>
      <div className="w-screen h-screen flex justify-center items-center ">
        <FormAuth registerForm={registerForm} />
      </div>
    </>
  );
}
