import { getServerSession } from "next-auth";
import FormDelivery from "./FormDelivery";
import {
  DeleteDeliveryItem,
  deliveryForm,
  setDefaultDeliveryItem,
} from "./actions";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import FormLogin from "./FormLogin";
import { getDelivery } from "@/lib/db/delivery";
import SelectDelivery from "./SelectDelivery";

export default async function Delivery() {
  const session = await getServerSession(authOptions);
  const delivery = await getDelivery();

  return (
    <>
      <div className="flex">
        <div className="flex flex-col space-y-8">
          <FormLogin session={session} />
          <FormDelivery deliveryForm={deliveryForm} session={session} />
          <SelectDelivery
            session={session}
            delivery={delivery}
            setDefaultDeliveryItem={setDefaultDeliveryItem}
            DeleteDeliveryItem={DeleteDeliveryItem}
          />
        </div>
        <div className="px-24 py-16">hello</div>
      </div>
    </>
  );
}
