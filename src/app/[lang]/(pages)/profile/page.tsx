import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { getOrder } from "@/lib/db/order";
import Menu from "./Menu";
import { getDelivery } from "@/lib/db/delivery";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  const order = await getOrder();
  const delivery = await getDelivery();
  if (!session) {
    redirect("/auth");
  }

  return (
    <div>
      <div className="flex">
        <Menu session={session} order={order} delivery={delivery} />
      </div>
    </div>
  );
}
