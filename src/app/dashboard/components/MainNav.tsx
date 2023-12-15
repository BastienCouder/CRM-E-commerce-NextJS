"use client";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import { PackageOpen, ShoppingCart, Users2, Wallpaper } from "lucide-react";

const navItems = [
  { href: "/dashboard", label: "Overview", icon: <Wallpaper size={15} /> },
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

export function MainNav({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  const pathname = usePathname();

  return (
    <nav
      className={cn("flex items-center space-x-4 lg:space-x-6", className)}
      {...props}
    >
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            buttonVariants({ variant: "outline" }),
            item.href !== "/dashboard" && pathname.startsWith(item.href)
              ? "bg-muted hover:bg-muted"
              : "hover:bg-muted",
            "border-none justify-start text-sm font-medium py-2 px-4 gap-x-2 capitalize"
          )}
        >
          <span className="text-secondary">{item.icon}</span>
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
