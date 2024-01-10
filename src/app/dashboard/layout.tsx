import "@/styles/globals.css";
import React, { Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProviders } from "@/context/ThemeContext";
import { MainNav } from "@/components/dashboard/MainNav";
import Loading from "@/app/[lang]/loading";
import { currentRole } from "@/lib/auth";
import { cn } from "@/lib/utils";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Dashboard",
  description: "Ceci est le dashboard de mon application.",
};

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const admin = await currentRole();
  if (!admin) {
    redirect("/");
  }

  return (
    <>
      <html lang="fr">
        <body
          className={cn("min-h-screen bg-background font-sans antialiased")}
        >
          <ThemeProviders>
            <div className={`hidden flex md:flex`}>
              <div className="w-[12rem] border-r border-[rgba(var(--foreground),0.5)]">
                <MainNav />
              </div>
              <Suspense fallback={<Loading />}>
                <div className="h-full w-full mt-4 pb-10 px-4">
                  <div className="flex flex-col gap-y-3">
                    {/* <CurrentPageIndicator /> */}
                    {children}
                  </div>
                </div>
              </Suspense>
              <Toaster />
            </div>
          </ThemeProviders>
        </body>
      </html>
    </>
  );
}
