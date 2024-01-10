"use server";
import { prisma } from "@/lib/prisma";
import { Category } from "@/schemas/db-schema";

export type CategoriesProps = Category & {
  ///
};

export async function getCategories(): Promise<CategoriesProps[] | null> {
  try {
    const categories = await prisma.category.findMany();

    if (!categories) {
      return null;
    }
    return categories;
  } catch (error) {
    console.error("Error while retrieving users:", error);
    return null;
  }
}
