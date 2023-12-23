"use server";
import { authOptions } from "@/app/[lang]/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/db/prisma";
import { Product, ProductVariant } from "@/lib/DbSchema";

export type ProductProps = Product & {
  ///
  variants?: ProductVariant[];
};

export async function getProducts(): Promise<ProductProps[] | null> {
  const session = await getServerSession(authOptions);

  if (session && session.user.role === "ADMIN") {
    try {
      const products = await prisma.product.findMany({
        where: { deleteAt: null || undefined },
        include: {
          variants: true,
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
    const session = await getServerSession(authOptions);

    if (session && session.user.role === "ADMIN") {
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
