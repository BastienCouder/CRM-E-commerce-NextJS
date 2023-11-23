import React from "react";
import TeamSwitcher from "./components/TeamSwitcher";
import { MainNav } from "./components/MainNav";
import { UserNav } from "./components/UserNav";
import { Search } from "./components/Search";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProviders } from "@/context/ThemeContext";

export const metadata = {
  title: "Dashboard",
  description: "Ceci est le dashboard de mon application.",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const currentFont = "inter";
  const fontClass =
    currentFont === "inter"
      ? "font-inter"
      : currentFont === "manrope"
      ? "font-manrope"
      : currentFont === "system"
      ? "font-system"
      : "";

  return (
    <>
      <div className={`hidden flex-col md:flex ${fontClass}`}>
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
        <div className="mt-8 pb-10 px-12">
          <ThemeProviders>{children}</ThemeProviders>
        </div>
        <Toaster />
      </div>
    </>
  );
}
