"use client";
import React from "react";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { User, Moon, Settings } from "lucide-react";
import { AreaNav } from "./AreaNav";

type NavSectionProps = {
  title: string;
  variant: "main" | "management" | "analytics" | "marketing";
};

const navSections: NavSectionProps[] = [
  { title: "Dashboard", variant: "main" },
  { title: "Gestion", variant: "management" },
  { title: "Analytics", variant: "analytics" },
  { title: "Marketing", variant: "marketing" },
];

export function MainNav() {
  function NavSection({ title, variant }: NavSectionProps) {
    return (
      <div className="flex flex-col gap-y-2 items-center">
        <h2 className="text-sm">{title}</h2>
        <Separator className="w-5/6 bg-[rgba(var(--foreground),0.5)]" />
        <AreaNav variant={variant} />
      </div>
    );
  }

  return (
    <nav>
      <div className="flex flex-col h-screen items-center space-y-12 py-4">
        {navSections.map(({ title, variant }) => (
          <NavSection key={variant} title={title} variant={variant} />
        ))}
        <div className="w-full justify-center flex space-x-8">
          <User size={20} />
          <Moon size={20} />
          <Link href="/dashboard/settings">
            <Settings size={20} />
          </Link>
        </div>
      </div>
    </nav>
  );
}
