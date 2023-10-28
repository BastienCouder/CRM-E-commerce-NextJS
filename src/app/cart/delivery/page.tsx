import { getServerSession } from "next-auth";
import FormDelivery from "./FormDelivery";
import { deliveryForm } from "./actions";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export default async function Delivery() {
  const session = await getServerSession(authOptions);
  return (
    <>
      <div className="border-b-2 border-zinc-800 h-24 flex justify-center items-center 2xl:mx-20">
        Logo
      </div>
      <div className="mt-8 pb-10 lg:px-16 xl:px-44 space-y-8 ">
        <FormDelivery deliveryForm={deliveryForm} session={session} />
      </div>
    </>
  );
}
