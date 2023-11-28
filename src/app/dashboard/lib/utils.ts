import { Category } from "@prisma/client";

export function findCategoryIdByName(
  categoryName: string,
  categories: Category[]
): string | undefined {
  const category = categories.find((c) => c.name === categoryName);
  return category?.id;
}
