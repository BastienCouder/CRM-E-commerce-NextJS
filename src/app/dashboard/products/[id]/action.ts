"use server";
import { revalidatePath } from "next/cache";
import { createProduct, getProducts } from "../../lib/db/product";
import { findCategoryIdByName } from "../../lib/utils";

export async function useServerUpdateProduct(
  productId: string,
  formData: FormData
) {
  const name = formData.get("name")?.toString() || "";
  const description = formData.get("description")?.toString() || "";
  const imageUrl = formData.get("imageUrl")?.toString() || "";
  const category = formData.get("category")?.toString() || "";
  const status = formData.get("status")?.toString() || "";
  const stock = parseInt(formData.get("stock")?.toString() || "0");

  // Find category
  const categories = await prisma.category.findMany();
  const categoryId = findCategoryIdByName(category, categories);

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
      stock: stock || null,
    };

    await prisma.product.update({
      where: { id: productId },
      data: updatedProduct,
    });

    revalidatePath(`/dashboard/products`);
    revalidatePath(`/products`);
    revalidatePath(`/dashboard/products/${productId}`);

    return updatedProduct;
  } catch (error) {
    console.error("Erreur lors de la mise à jour du produit :", error);
    return null;
  }
}

export async function useServerUpdateProductStatus(
  productId: string,
  newStatus: string
) {
  try {
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      console.error("Product not found.");
      return null;
    }

    const updatedProduct = await prisma.product.update({
      where: { id: productId },
      data: {
        status: newStatus,
      },
    });

    revalidatePath(`/dashboard/products`);
    revalidatePath(`/products`);
    revalidatePath(`/dashboard/products/${productId}`);

    return updatedProduct;
  } catch (error) {
    console.error(
      "Erreur lors de la mise à jour du statut du produit :",
      error
    );
    return null;
  }
}

export async function useServerUpdateProductLabel(
  productId: string,
  newLabel: string
) {
  try {
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      console.error("Product not found.");
      return null;
    }

    const updatedProduct = await prisma.product.update({
      where: { id: productId },
      data: {
        label: newLabel,
      },
    });

    revalidatePath(`/dashboard/products`);
    revalidatePath(`/products`);
    revalidatePath(`/dashboard/products/${productId}`);

    return updatedProduct;
  } catch (error) {
    console.error(
      "Erreur lors de la mise à jour du statut du produit :",
      error
    );
    return null;
  }
}

export async function useServerUpdateProductFavourites(
  productId: string,
  newFavourites: string
) {
  try {
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      console.error("Product not found.");
      return null;
    }

    const priorityValue =
      product.priority === "favorites" ? null : newFavourites;

    const updatedProduct = await prisma.product.update({
      where: { id: productId },
      data: {
        priority: priorityValue,
      },
    });

    revalidatePath(`/dashboard/products`);
    revalidatePath(`/products`);
    revalidatePath(`/dashboard/products/${productId}`);

    return updatedProduct;
  } catch (error) {
    console.error(
      "Erreur lors de la mise à jour du statut du produit :",
      error
    );
    return null;
  }
}

export async function useServerDuplicateProduct(productId: string) {
  try {
    const productToDuplicate = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!productToDuplicate) {
      console.error("Product not found.");
      return null;
    }

    const duplicatedProduct = {
      ...productToDuplicate,
      id: undefined,
      name: `${productToDuplicate.name}-copy`,
    };

    const createdProduct = await prisma.product.create({
      data: duplicatedProduct,
    });

    revalidatePath(`/dashboard/products`);
    revalidatePath(`/products`);
    revalidatePath(`/dashboard/products/${productId}`);

    return createdProduct;
  } catch (error) {
    console.error("Erreur lors de la duplication du produit :", error);
    return null;
  }
}
