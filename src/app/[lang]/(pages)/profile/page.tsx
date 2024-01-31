import { getOrder } from "@/lib/db/order";
import Menu from "@/components/profile/interface-profile";
import { getDelivery } from "@/lib/db/delivery";
import { auth } from "@/auth";

export default async function Profile() {
  const session = await auth();
  const order = await getOrder();
  const delivery = await getDelivery();

  return (
    <>
      <div className="flex">
        <Menu session={session} order={order} delivery={delivery} />
      </div>
    </>
  );
}
