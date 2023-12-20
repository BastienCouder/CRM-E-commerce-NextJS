import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { checkUserRole } from "@/middlewares/Admin";
import { ThemeProviders } from "@/context/ThemeContext";
import { MainNav } from "@/components/dashboard/MainNav";

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
          <div className="w-[12rem] border-r border-[rgba(var(--foreground),0.5)]">
            <MainNav />
          </div>
          <div className="h-full w-full mt-4 pb-10 px-4">{children}</div>
          <Toaster />
        </div>
      </ThemeProviders>
    </>
  );
}
