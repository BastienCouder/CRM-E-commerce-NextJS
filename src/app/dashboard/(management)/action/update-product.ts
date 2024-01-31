"use server";

import { findCategoryIdByName } from "@/lib/utils";
import { getProducts } from "@/lib/db/product";
import { currentUser, roleCheckMiddleware } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

export async function updateProduct(productId: string, formData: FormData) {
  const name = formData.get("name")?.toString() || "";
  const description = formData.get("description")?.toString() || "";
  const imageUrl = formData.get("imageUrl")?.toString() || "";
  const category = formData.get("category")?.toString() || "";
  const stock = parseInt(formData.get("stock")?.toString() || "0");

  const categories = await prisma.category.findMany();
  const categoryId = findCategoryIdByName(category, categories);

  const session = await currentUser();

  if (roleCheckMiddleware(session, ["ADMIN"])) {
    try {
      const products = await getProducts();

      if (!products) {
        console.error("Unable to retrieve products.");
        return null;
      }

      const product = products.find((item) => item.id === productId);

      if (!product) {
        console.error("Product not found.");
        return null;
      }

      const updatedProduct = {
        name,
        description,
        imageUrl,
        categoryId: categoryId || null,
        stock: stock,
      };

      await prisma.product.update({
        where: { id: productId },
        data: updatedProduct,
      });

      revalidatePath("/dashboard");

      return updatedProduct;
    } catch (error) {
      console.error("Erreur lors de la mise à jour du produit :", error);
      return null;
    }
  } else {
    throw new Error(
      "Accès refusé : Vous n'avez pas les autorisations nécessaires."
    );
  }
}
