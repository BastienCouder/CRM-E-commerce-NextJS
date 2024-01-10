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

export function replaceUnderscoresWithSpaces(str: string) {
  return str.replace(/_/g, " ");
}

export function replaceUnderscoresWithDash(str: string) {
  return str.replace(/_/g, "-");
}

export function replaceEncodedSpaces(str: string) {
  return str.replace(/%20/g, " ");
}

export const validateString = (value: unknown, maxLength: number) => {
  if (!value || typeof value !== "string" || value.length > maxLength) {
    return false;
  }
  return true;
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
import { Browser, BrowserEnum, Category } from "@/schemas/db-schema";

export function findCategoryIdByName(
  categoryName: string,
  categories: Category[]
): string | undefined {
  const category = categories.find((category) => category === categoryName);
  return category;
}

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

export function mapBrowserName(browserName: string): Browser {
  switch (true) {
    case browserName.startsWith("Chrome"):
      return BrowserEnum.parse("Chrome");
    case browserName.startsWith("Edge"):
      return BrowserEnum.parse("Edge");
    case browserName.startsWith("Safari"):
      return BrowserEnum.parse("Safari");
    case browserName.startsWith("Opera"):
      return BrowserEnum.parse("Opera");
    case browserName.startsWith("Firefox"):
      return BrowserEnum.parse("Firefox");
    case browserName.startsWith("IE"):
      return BrowserEnum.parse("IE");
    case browserName.startsWith("Netscape"):
      return BrowserEnum.parse("Netscape");
    default:
      return BrowserEnum.parse("Other");
  }
}

export async function fetchPostJSON(url: string, data: any) {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }

  return response.json();
}
