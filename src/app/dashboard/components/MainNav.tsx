"use client";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import {
  Eye,
  PackageOpen,
  Paperclip,
  ShoppingCart,
  Users2,
  Wallpaper,
} from "lucide-react";

const mainNavItems = [
  { href: "/dashboard", label: "Overview", icon: <Wallpaper size={15} /> },
];

const managementNavItems = [
  {
    href: "/dashboard/orders",
    label: "Commandes",
    icon: <ShoppingCart size={15} />,
  },
  {
    href: "/dashboard/products",
    label: "Produits",
    icon: <PackageOpen size={15} />,
  },
  {
    href: "/dashboard/users",
    label: "Utilisateurs",
    icon: <Users2 size={15} />,
  },
];

const analyticsNavItems = [
  {
    href: "/dashboard/analytics/views",
    label: "Views",
    icon: <Eye size={15} />,
  },
];

const marketingNavItems = [
  {
    href: "/dashboard/newsletter",
    label: "Newsletter",
    icon: <Paperclip size={15} />,
  },
];

export function MainNav({
  className,
  variant = "main",
  ...props
}: React.HTMLAttributes<HTMLElement> & {
  variant?: "main" | "management" | "analytics" | "marketing";
}) {
  const pathname = usePathname();

  let navItems;
  switch (variant) {
    case "main":
      navItems = mainNavItems;
      break;
    case "management":
      navItems = managementNavItems;
      break;
    case "analytics":
      navItems = analyticsNavItems;
      break;
    case "marketing":
      navItems = marketingNavItems;
      break;
    default:
      navItems = mainNavItems;
  }

  return (
    <nav
      className={cn(
        "w-full flex flex-col items-center space-y-4 px-2",
        className
      )}
      {...props}
    >
      {navItems?.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            buttonVariants({ variant: "ghost" }),
            item.href !== "/dashboard" && pathname.startsWith(item.href)
              ? "bg-muted hover:bg-muted"
              : "hover:bg-muted",
            "w-[10rem] border-none justify-start text-sm font-medium py-2 px-4 gap-x-2"
          )}
        >
          <span className="text-secondary">{item.icon}</span>
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
