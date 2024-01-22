"use client";
import React from "react";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { User, Moon, Settings } from "lucide-react";
import { AreaNav } from "./AreaNav";
import ColorCircles from "./ColorCircles";
import { ThemeSwitcher } from "./theme-switcher";

type NavSectionProps = {
  title: string;
  variant: "main" | "management" | "marketing";
};

const navSections: NavSectionProps[] = [
  { title: "Dashboard", variant: "main" },
  { title: "Gestion", variant: "management" },
  { title: "Marketing", variant: "marketing" },
];

export function MainNav() {
  function NavSection({ title, variant }: NavSectionProps) {
    return (
      <div className="flex flex-col gap-y-2">
        <h2 className="text-xs font-bold cpitalize px-2">{title}</h2>
        <Separator />
        <AreaNav variant={variant} />
      </div>
    );
  }

  return (
    <nav>
      <div className="flex flex-col h-screen items-center gap-y-12 py-4">
        {navSections.map(({ title, variant }) => (
          <NavSection key={variant} title={title} variant={variant} />
        ))}
        {/* <div className="w-full justify-center flex space-x-8">
          <User size={20} />
          <Moon size={20} />
          <Link href="/dashboard/settings">
            <Settings size={20} />
          </Link>
        </div> */}
        <ThemeSwitcher />
      </div>
    </nav>
  );
}
