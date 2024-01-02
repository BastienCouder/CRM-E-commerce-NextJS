"use server";
import { prisma } from "@/lib/prisma";
import { env } from "@/lib/env";
import { revalidatePath } from "next/cache";

export interface AnalyticsWishlistCartOrder {
  productId: string;
  name: string;
  nameVariant?: string;
  wishlistCount: number;
  cartCount: number;
  orderCount: number;
  date: Date;
}

export interface readAnalyticsWishlistCartOrderProps {
  data: AnalyticsWishlistCartOrder[];
}

export async function readAnalyticsWishlistCartOrder(): Promise<readAnalyticsWishlistCartOrderProps> {
  try {
    const endDate = new Date();
    const siteCreationDate = new Date(env.CREATE_WEBSITE || "");
    const startDate = siteCreationDate < endDate ? siteCreationDate : endDate;

    const [orderItems, wishlistItems, cartItems] = await Promise.all([
      prisma.orderItems.findMany({
        include: {
          cart: {
            include: {
              cartItems: {
                include: {
                  product: true,
                },
              },
            },
          },
        },
        where: {
          createdAt: {
            gte: startDate,
            lt: endDate,
          },
        },
      }),
      prisma.wishlistItems.findMany({
        where: {
          createdAt: {
            gte: startDate,
            lt: endDate,
          },
        },
      }),
      prisma.cartItems.findMany({
        where: {
          createdAt: {
            gte: startDate,
            lt: endDate,
          },
        },
      }),
    ]);

    let productAnalyticsMap: Record<string, AnalyticsWishlistCartOrder> = {};

    orderItems.forEach(({ cart }) => {
      cart.cartItems.forEach(({ product }) => {
        const productId = product.id;
        if (!productAnalyticsMap[productId]) {
          productAnalyticsMap[productId] = {
            productId,
            name: product.name,
            wishlistCount: 0,
            cartCount: 0,
            orderCount: 0,
            date: product.createdAt!,
          };
        }
        productAnalyticsMap[productId].orderCount++;
      });
    });

    for (const item of wishlistItems) {
      let product;
      const idKey = item.productId;
      product = await prisma.product.findUnique({
        where: { id: item.productId },
      });

      productAnalyticsMap[idKey] = productAnalyticsMap[idKey] || {
        productId: idKey,
        name: product?.name,
        wishlistCount: 0,
        cartCount: 0,
        orderCount: 0,
      };
      productAnalyticsMap[idKey].wishlistCount++;
    }

    cartItems.forEach((item) => {
      const productId = item.productId;
      productAnalyticsMap[productId] = productAnalyticsMap[productId] || {
        productId,
        name: "Unknown Product",
        wishlistCount: 0,
        cartCount: 0,
        orderCount: 0,
      };
      productAnalyticsMap[productId].cartCount++;
    });

    const analyticsData = Object.values(productAnalyticsMap);

    revalidatePath("/dashboard");

    return {
      data: analyticsData,
    };
  } catch (error: any) {
    throw new Error(
      "Erreur lors de la récupération des données pour les produits : " +
        error.message
    );
  } finally {
    await prisma.$disconnect();
  }
}
