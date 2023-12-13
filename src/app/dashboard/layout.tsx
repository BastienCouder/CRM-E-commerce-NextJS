import React from "react";
import TeamSwitcher from "./components/TeamSwitcher";
import { MainNav } from "./components/MainNav";
import { UserNav } from "./components/UserNav";
import { Search } from "./components/Search";
import { Toaster } from "@/components/ui/toaster";
import { checkUserRole } from "@/middlewares/Admin";
import { Moon, Settings, User } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Dashboard",
  description: "Ceci est le dashboard de mon application.",
};

async function fetchData() {
  try {
    const result = await checkUserRole();
    if (result) {
      console.log("Bienvenue");
    } else {
      // return redirect("/");
      console.log("au revoir");
      // return redirect("/");
    }
  } catch (error) {
    console.error(
      "Erreur lors de la vérification du rôle utilisateur :",
      error
    );
  }
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  fetchData();
  return (
    <>
      <div className={`hidden flex-col md:flex`}>
        <div className="border-b">
          <div className="flex h-16 items-center justify-between px-4">
            <MainNav className="mx-6" />
            <div className="flex space-x-4">
              <User size={20} />
              <Moon size={20} />
              <Link href="/dashboard/settings">
                <Settings size={20} />
              </Link>
            </div>
          </div>
        </div>
        <div className="mt-8 pb-10 px-12">{children}</div>
        <Toaster />
      </div>
    </>
  );
}
