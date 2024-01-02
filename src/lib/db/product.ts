"use server";
import { prisma } from "@/lib/prisma";
import { Product } from "@/schemas/DbSchema";
import { auth } from "@/auth";
import { roleCheckMiddleware } from "../auth";

export type ProductProps = Product & {
  ///
};

export async function getProducts(): Promise<ProductProps[] | null> {
  const session = await auth();
  const response = roleCheckMiddleware(session);

  if (session && response) {
    try {
      const products = await prisma.product.findMany({
        where: { deleteAt: null || undefined },
        orderBy: {
          id: "desc",
        },
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
    const session = await auth();
    const response = roleCheckMiddleware(session);

    if (session && response) {
      const createdProduct = await prisma.product.create({
        data: {
          name: "",
          description: "",
          imageUrl: "",
          price: 0,
          status: "unavailable",
          stock: 0,
        },
      });
      return {
        ...createdProduct,
        variants: [],
      } as ProductProps;
    } else {
      throw new Error("Utilisateur non autorisé pour la création de produits.");
    }
  } catch (error) {
    console.error("Erreur lors de la création du produit :", error);
    return null;
  }
}
