"use client";
import { usePathname } from "next/navigation";

export default function CurrentPageIndicator() {
  const pathname = usePathname();
  const pageTitle = pathname
    .split("/")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" > ");

  return <h1 className="text-sm font-bold">{pageTitle}</h1>;
}
