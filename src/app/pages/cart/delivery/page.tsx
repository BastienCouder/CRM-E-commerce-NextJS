import { getServerSession } from "next-auth";
import FormDelivery from "../../../../components/FormDelivery";
import {
  useServerDeleteDeliveryItem,
  useServerSetDefaultDeliveryItem,
  useServerDeliveryForm,
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
          <div className="px-4 md:px-20 xl:p-0 space-y-8 ">
            <h1 className="text-4xl text-center md:text-start">Livraison</h1>
            <FormDelivery
              deliveryForm={useServerDeliveryForm}
              session={session}
            />
          </div>
          <SelectDelivery
            session={session}
            delivery={delivery}
            setDefaultDeliveryItem={useServerSetDefaultDeliveryItem}
            DeleteDeliveryItem={useServerDeleteDeliveryItem}
          />
        </div>
        <div className="px-24 py-16"></div>
      </div>
    </>
  );
}
