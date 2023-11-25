import React from "react";
import TeamSwitcher from "./components/TeamSwitcher";
import { MainNav } from "./components/MainNav";
import { UserNav } from "./components/UserNav";
import { Search } from "./components/Search";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProviders } from "@/context/ThemeContext";
import { FontProvider } from "@/context/FontContext";
import { checkUserRole } from "@/middlewares/Admin";
import { error } from "console";
import { redirect } from "next/navigation";

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
          <div className="flex h-16 items-center px-4">
            <TeamSwitcher />
            <MainNav className="mx-6" />
            <div className="ml-auto flex items-center space-x-4">
              <Search />
              <UserNav />
            </div>
          </div>
        </div>
        <div className="mt-8 pb-10 px-12">{children}</div>
        <Toaster />
      </div>
    </>
  );
}
