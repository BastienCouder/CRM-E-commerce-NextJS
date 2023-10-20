import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

import Logout from "@/components/Logout";

export default async function dashboardPage() {
  const session = await getServerSession(authOptions);
  console.log(session);

  if (!session) {
    redirect("/auth");
  }
  return (
    <div>
      dashboard
      <Logout />
    </div>
  );
}
