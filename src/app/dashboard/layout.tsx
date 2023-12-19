import React from "react";
import TeamSwitcher from "./components/TeamSwitcher";
import { MainNav } from "./components/MainNav";
import { UserNav } from "./components/UserNav";
import { Search } from "./components/Search";
import { Toaster } from "@/components/ui/toaster";
import { checkUserRole } from "@/middlewares/Admin";
import { Moon, Settings, User } from "lucide-react";
import Link from "next/link";
import ColorCircles from "./components/ColorCircles";
import { ThemeProviders } from "@/context/ThemeContext";
import { Separator } from "@/components/ui/separator";

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
      <ThemeProviders>
        <div className={`hidden flex md:flex`}>
          <div className="w-[12rem] border-r">
            <div className="flex flex-col h-screen items-center space-y-12 py-4 overflow-y-auto">
              <div className="flex flex-col gap-y-2 items-center">
                <h2 className="text-base">Dashboard</h2>
                <Separator className="w-5/6" />
                <MainNav variant="main" />
              </div>

              <div className="flex flex-col gap-y-2 items-center">
                <h2 className="text-base">Gestion</h2>
                <Separator className="w-5/6" />
                <MainNav variant="management" />
              </div>
              <div className="flex flex-col gap-y-2 items-center">
                <h2 className="text-base">Analytics</h2>
                <Separator className="w-5/6" />
                <MainNav variant="analytics" />
              </div>
              <div className="flex flex-col gap-y-2 items-center">
                <h2 className="text-base">Marketing</h2>
                <Separator className="w-5/6" />
                <MainNav variant="marketing" />
              </div>
              <div className="w-full justify-center flex space-x-8">
                <User size={20} />
                <Moon size={20} />

                <Link href="/dashboard/settings">
                  <Settings size={20} />
                </Link>
              </div>
            </div>
          </div>
          <div className=" w-full mt-4 pb-10 px-4">{children}</div>
          <Toaster />
        </div>
      </ThemeProviders>
    </>
  );
}
