import { Category } from "@prisma/client";
import { subDays, subMonths, subYears } from "date-fns";

export function findCategoryIdByName(
  categoryName: string,
  categories: Category[]
): string | undefined {
  const category = categories.find((c) => c.name === categoryName);
  return category?.id;
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
