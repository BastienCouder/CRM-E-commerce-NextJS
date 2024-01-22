"use client";
import { Separator } from "@/components/ui/separator";
import { SidebarNav } from "@/components/dashboard/SideBar";

interface SettingsLayoutProps {
  children: React.ReactNode;
  params: {
    id: string;
  };
}

export default function ProductLayout({
  children,
  params: { id },
}: SettingsLayoutProps) {
  const sidebarNavItems = [
    {
      title: "Informations",
      href: `/dashboard/management/products/${id}`,
    },

    {
      title: "Options",
      href: `/dashboard/management/products/${id}/settings`,
    },
  ];

  return (
    <>
      <div className="hidden space-y-6 px-10 pb-16 md:block">
        <div className="space-y-0.5">
          <h2 className="text-2xl font-bold trackin ,g-tight">Produit</h2>
          <p className="text-muted-foreground">
            Gérer les paramètres du produit et définissez vos préférences.
          </p>
        </div>
        <Separator className="my-6" />
        <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
          <aside className="-mx-4 lg:w-1/5">
            <SidebarNav items={sidebarNavItems} />
          </aside>
          <div className="flex-1 lg:max-w-2xl">{children}</div>
        </div>
      </div>
    </>
  );
}
