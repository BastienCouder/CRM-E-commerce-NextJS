"use client";
import React from "react";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { User, Moon, Settings } from "lucide-react";
import { AreaNav } from "./area-nav";
import ColorCircles from "./color-circles";
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
        {navSections.map(({ title, variant }, index) => (
          <NavSection key={index} title={title} variant={variant} />
        ))}
        <ThemeSwitcher />
      </div>
    </nav>
  );
}
