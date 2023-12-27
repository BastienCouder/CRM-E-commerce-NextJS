import React, { Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProviders } from "@/context/ThemeContext";
import { MainNav } from "@/components/dashboard/MainNav";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import Loading from "@/app/loading";

export const metadata = {
  title: "Dashboard",
  description: "Ceci est le dashboard de mon application.",
};

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  if (session?.user.role !== "ADMIN") {
    throw new Error("error");
  }

  return (
    <>
      <ThemeProviders>
        <div className={`hidden flex md:flex`}>
          <div className="w-[12rem] border-r border-[rgba(var(--foreground),0.5)]">
            <MainNav />
          </div>
          <Suspense fallback={<Loading />}>
            <div className="h-full w-full mt-4 pb-10 px-4">{children}</div>
          </Suspense>
          <Toaster />
        </div>
      </ThemeProviders>
    </>
  );
}
