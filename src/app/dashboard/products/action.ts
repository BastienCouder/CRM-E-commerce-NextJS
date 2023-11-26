"use server";
import { revalidatePath } from "next/cache";
import { getProducts, createProduct, ProductProps } from "../lib/db/product";

export async function useServerUpdateProduct(
  productId: string,
  updatedProductData: Partial<ProductProps>
) {
  try {
    const products = (await getProducts()) ?? (await createProduct());

    if (Array.isArray(products)) {
      const existingProductIndex = products.findIndex(
        (item) => item.id === productId
      );

      if (existingProductIndex === -1) {
        console.error("Product not found.");
        return null;
      }
      const updatedProducts = [...products];
      updatedProducts[existingProductIndex] = {
        ...updatedProducts[existingProductIndex],
        ...updatedProductData,
      };

      const updatedProduct = await prisma.product.update({
        where: { id: productId },
        data: updatedProductData,
      });

      revalidatePath(`/products/${productId}`);

      return updatedProduct;
    } else {
      console.error("Products is not an array.");
      return null;
    }
  } catch (error) {
    console.error("Erreur lors de la mise à jour du produit :", error);
    return null;
  }
}

export async function useServerSoftDeleteProduct(productId: string) {
  try {
    const products = (await getProducts()) ?? (await createProduct());

    if (Array.isArray(products)) {
      const product = products.find((item) => item.id === productId);

      if (!product) {
        console.error("Product not found.");
        return null;
      }

      const deletedProduct = await prisma.product.update({
        where: { id: productId },
        data: { deleteAt: new Date(), status: "delete" },
      });
      revalidatePath(`/products/${productId}`);
      return deletedProduct;
    } else {
      console.error("Products is not an array.");
      return null;
    }
  } catch (error) {
    console.error("Erreur lors de la suppression du produit :", error);
    return null;
  }
}

export async function useServerDeleteProduct(productId: string) {
  try {
    const products = (await getProducts()) ?? (await createProduct());

    if (Array.isArray(products)) {
      const product = products.find((item) => item.id === productId);

      if (!product) {
        console.error("Product not found.");
        return null;
      }

      const deletedProduct = await prisma.product.delete({
        where: { id: productId },
      });

      revalidatePath(`/products/${productId}`);
      return deletedProduct;
    } else {
      console.error("Products is not an array.");
      return null;
    }
  } catch (error) {
    console.error("Erreur lors de la suppression du produit :", error);
    return null;
  }
}
