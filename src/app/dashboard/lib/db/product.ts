"use server";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { checkUserRole } from "@/middlewares/Admin";
import { Product } from "@prisma/client";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/db/prisma";

export type ProductProps = Product & {
  ///
};

export async function getProducts(): Promise<ProductProps[] | null> {
  const session = await getServerSession(authOptions);
  const admin = await checkUserRole();

  if (!session && !admin) {
    try {
      const products = await prisma.product.findMany({
        where: { deleteAt: null || undefined },
      });

      return products as ProductProps[];
    } catch (error) {
      console.error("Erreur lors de la récupération des produits :", error);
      return null;
    }
  } else {
    console.error(
      "Erreur lors de la récupération des produits : Utilisateur non autorisé"
    );
    return null;
  }
}

export async function createProduct(): Promise<ProductProps | null> {
  try {
    const session = await getServerSession(authOptions);
    const admin = await checkUserRole();

    if (!session || !admin) {
      console.error("Utilisateur non autorisé pour la création de produits.");
      return null;
    }

    const createdProduct = await prisma.product.create({
      data: {
        name: "",
        description: "",
        imageUrl: "",
        price: 0,
      },
    });

    return createdProduct;
  } catch (error) {
    console.error("Erreur lors de la création du produit :", error);
    return null;
  }
}

export async function updateProduct(
  productId: string,
  updatedData: Partial<Product>
): Promise<Product | null> {
  try {
    const session = await getServerSession(authOptions);
    const admin = await checkUserRole();

    if (!session || !admin) {
      console.error("Utilisateur non autorisé pour la mise à jour du produit.");
      return null;
    }

    const updatedProduct = await prisma.product.update({
      where: { id: productId },
      data: updatedData,
    });

    return updatedProduct;
  } catch (error) {
    console.error("Erreur lors de la mise à jour du produit :", error);
    return null;
  }
}
