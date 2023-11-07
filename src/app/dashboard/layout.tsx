import Navbar from "@/app/dashboard/Navbar/Navbar";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
export const metadata = {
  title: "Dashboard E-commerce",
  description: "Ceci est le dashboard de mon application.",
};

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // const session = await getServerSession(authOptions);
  // const AdminSession = checkAdminRole(session);

  // if (!session || (AdminSession && AdminSession.user.role !== "admin")) {
  //   redirect("/");
  // }

  return (
    <div className="flex">
      <Navbar />
      <div className="h-screen p-4">{children}</div>
    </div>
  );
}
