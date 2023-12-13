"use client";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/dashboard", label: "Overview" },
  { href: "/dashboard/orders", label: "Commandes" },
  { href: "/dashboard/products", label: "Produits" },
  { href: "/dashboard/users", label: "Utilisateurs" },
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
            buttonVariants({ variant: "ghost" }),
            item.href !== "/dashboard" && pathname.startsWith(item.href)
              ? "bg-muted hover:bg-muted"
              : "hover:bg-muted",
            "border border-muted justify-start text-sm font-medium py-2 px-4 w-28"
          )}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
