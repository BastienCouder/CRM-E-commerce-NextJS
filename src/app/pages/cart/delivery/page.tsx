import { getServerSession } from "next-auth";
import FormDelivery from "./FormDelivery";
import { deliveryForm } from "./actions";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export default async function Delivery() {
  const session = await getServerSession(authOptions);
  return (
    <>
      <FormDelivery deliveryForm={deliveryForm} session={session} />
    </>
  );
}
