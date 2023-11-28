"use client";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/dashboard", label: "Overview" },
  { href: "/dashboard/customers", label: "Customers" },
  { href: "/dashboard/products", label: "Produits" },
  { href: "/dashboard/settings", label: "Options" },
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
            "justify-start text-sm font-medium py-3 px-4 w-28"
          )}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
