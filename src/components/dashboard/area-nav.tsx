"use client";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import {
  Eye,
  Mail,
  PackageOpen,
  Paperclip,
  ShoppingCart,
  Users2,
  Wallpaper,
} from "lucide-react";

const areaNavItems = [
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
  {
    href: "/dashboard/analytics",
    label: "Views",
    icon: <Eye size={15} />,
  },
];

const marketingNavItems = [
  {
    href: "/dashboard/campaign",
    label: "Campagne",
    icon: <Paperclip size={15} />,
  },
  {
    href: "/dashboard/mail",
    label: "Mail",
    icon: <Mail size={15} />,
  },
];
export function AreaNav({
  className,
  variant = "main",
  ...props
}: React.HTMLAttributes<HTMLElement> & {
  variant?: "main" | "management" | "marketing";
}) {
  const pathname = usePathname();

  let navItems;
  switch (variant) {
    case "main":
      navItems = areaNavItems;
      break;
    case "management":
      navItems = managementNavItems;
      break;
    case "marketing":
      navItems = marketingNavItems;
      break;
    default:
      navItems = areaNavItems;
  }

  return (
    <ul
      className={cn(
        "w-full flex flex-col items-center space-y-2 px-2",
        className
      )}
      {...props}
    >
      {navItems.map((item, index) => (
        <li key={index}>
          <Link
            href={item.href}
            className={cn(
              buttonVariants({ variant: "ghost" }),
              "w-[10rem] bg-none flex items-center border-none justify-start text-sm font-medium py-2 px-4 gap-x-2",
              {
                "bg-muted hover:bg-muted":
                  item.href !== "/dashboard" && pathname.startsWith(item.href),
              }
            )}
          >
            <span className="text-primary">{item.icon}</span>
            <span className="mb-px">{item.label}</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
