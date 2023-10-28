import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { getOrder } from "@/lib/db/order";
import Menu from "./Menu";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  const order = await getOrder();

  if (!session) {
    redirect("/auth");
    return null;
  }

  return (
    <div>
      <div className="flex">
        <Menu session={session} order={order} />
      </div>
    </div>
  );
}
