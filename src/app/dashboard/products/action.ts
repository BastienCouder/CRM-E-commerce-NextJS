import { PrismaClient } from "@prisma/client";
import { env } from "@/lib/env";
import { revalidatePath } from "next/cache";

export interface AnalyticsData {
  productId: string;
  priority: string[];
  name: string;
  totalSales: number;
}

export interface useServerReadAnalyticsProductsProps {
  data: AnalyticsData[];
  topProducts: AnalyticsData[];
  totalSales: number;
}

export async function useServerReadAnalyticsProducts(): Promise<useServerReadAnalyticsProductsProps> {
  const prisma = new PrismaClient();
  try {
    const endDate = new Date();
    const siteCreationDate = new Date(env.CREATE_WEBSITE || "");
    const startDate = siteCreationDate < endDate ? siteCreationDate : endDate;

    const orderItems = await prisma.orderItems.findMany({
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
    });

    const productSalesMap: Record<string, AnalyticsData> = {};
    orderItems.forEach((orderItem) => {
      orderItem.cart.cartItems.forEach((cartItem) => {
        const productId = cartItem.product.id;
        const productName = cartItem.product.name;
        const productPriority = Array.isArray(cartItem.product.priority)
          ? cartItem.product.priority
          : [cartItem.product.priority];
        const productPrice = cartItem.product.price;

        if (!productSalesMap[productId]) {
          productSalesMap[productId] = {
            productId,
            priority: productPriority,
            name: productName,
            totalSales: 0,
          };
        }
        productSalesMap[productId].totalSales +=
          productPrice * cartItem.quantity;
      });
    });

    const productSalesArray = Object.values(productSalesMap);

    const topProducts = productSalesArray
      .sort((a, b) => b.totalSales - a.totalSales)
      .slice(0, 5);

    await prisma.product.updateMany({
      where: {
        priority: {
          has: "best seller",
        },
      },
      data: {
        priority: {
          set: [],
        },
      },
    });

    await Promise.all(
      topProducts.map((product) =>
        prisma.product.update({
          where: { id: product.productId },
          data: { priority: { push: "best seller" } },
        })
      )
    );

    const totalSales = productSalesArray.reduce(
      (acc, product) => acc + product.totalSales,
      0
    );

    revalidatePath(`/dashboard`);
    revalidatePath(`/dashboard/products`);

    return {
      data: productSalesArray,
      topProducts,
      totalSales,
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
