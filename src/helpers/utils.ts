import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export const VAT_RATE = 0.2;

export const validateEmail = (email: string): boolean => {
  const emailRegex =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return emailRegex.test(email.toLowerCase());
};

export function generateOrderNumber(): string {
  const length = 12;
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let orderNumber = "CMD";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    orderNumber += characters.charAt(randomIndex);
  }

  return orderNumber;
}

export function handleStatusChange(value: string): string {
  switch (value) {
    case "waiting":
      return "En attente";
    case "in progress":
      return "En cours";
    case "delivered":
      return "Livrée";
    case "cancel":
      return "Annulée";
    case "refunded":
      return "Remboursée";
    default:
      return "Annulée";
  }
}

import { subDays, subMonths, subYears } from "date-fns";
import { Category } from "@/lib/DbSchema";

export function findCategoryIdByName(
  categoryName: string,
  categories: Category[]
): string | undefined {
  const category = categories.find((category) => category === categoryName);
  return category;
}

export const calculateSubtotal = (order: any) => {
  return (
    order.cart?.cartItems.reduce((acc: number, item: any) => {
      const variantPrice = item.variant ? item.variant.price : null;
      const productPrice = item.product ? item.product.price : null;
      const price =
        variantPrice !== null
          ? variantPrice
          : productPrice !== null
          ? productPrice
          : 0;

      return acc + item.quantity * price;
    }, 0) || 0
  );
};

export function getStartDateForFilter(
  filterType: "day" | "week" | "month" | "year" | "sinceCreation",
  siteCreationDate: Date
): Date {
  const now = new Date();
  switch (filterType) {
    case "day":
      return subDays(now, 1);
    case "week":
      return subDays(now, 7);
    case "month":
      return subMonths(now, 1);
    case "year":
      return subYears(now, 1);
    case "sinceCreation":
      return siteCreationDate;
    default:
      throw new Error("Type de filtre non valide");
  }
}
