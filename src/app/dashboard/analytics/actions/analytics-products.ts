"use server";

import { prisma } from "@/lib/prisma";
import { env } from "@/lib/env";
import { subMonths, startOfMonth, endOfMonth } from "date-fns";
import { revalidatePath } from "next/cache";

export interface AnalyticsProductsData {
  date: Date;
  productId: string;
  priority: string[];
  name: string;
  totalSales: number;
}

export interface readAnalyticsProductsProps {
  data: AnalyticsProductsData[];
  topProducts: AnalyticsProductsData[];
  totalSales: number;
  totalProductsSales: number;
  currentMonthSales: number;
  lastMonthSales: number;
  salesGrowthPercentage: number;
}

export async function readAnalyticsProducts(): Promise<readAnalyticsProductsProps> {
  try {
    const endDate = new Date();
    const startDate = new Date(env.CREATE_WEBSITE || "");
    const currentMonthStart = startOfMonth(endDate);
    const lastMonthStart = startOfMonth(subMonths(endDate, 1));
    const lastMonthEnd = endOfMonth(subMonths(endDate, 1));

    let currentMonthSales = 0;
    let lastMonthSales = 0;
    let totalProductsSold = 0;

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

    const productSalesMap: Record<string, AnalyticsProductsData> = {};
    orderItems.forEach((orderItem) => {
      const orderDate = new Date(orderItem.createdAt!);
      const isCurrentMonth =
        orderDate >= currentMonthStart && orderDate <= endDate;
      const isLastMonth =
        orderDate >= lastMonthStart && orderDate < lastMonthEnd;

      orderItem.cart.cartItems.forEach((cartItem) => {
        const productId = cartItem.product.id;
        const productName = cartItem.product.name;
        const productPriority = Array.isArray(cartItem.product.priority)
          ? cartItem.product.priority
          : [cartItem.product.priority];
        const productPrice = cartItem.product.price;
        const productSales = productPrice * cartItem.quantity;
        const productQuantity = cartItem.quantity;
        totalProductsSold += productQuantity;

        if (isCurrentMonth) currentMonthSales += productQuantity;
        if (isLastMonth) lastMonthSales += productQuantity;

        if (!productSalesMap[productId]) {
          productSalesMap[productId] = {
            date: orderDate,
            productId,
            priority: productPriority,
            name: productName,
            totalSales: 0,
          };
        }
        productSalesMap[productId].totalSales += productSales;
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

    const totalSales: number = productSalesArray.reduce(
      (acc, product) => acc + product.totalSales,
      0
    );
    const salesGrowthPercentage: number =
      lastMonthSales === 0
        ? 0
        : ((currentMonthSales - lastMonthSales) / lastMonthSales) * 100;

    // Retourner les données seulement si elles ne sont pas vides
    if (productSalesArray.length > 0) {
      const topProducts = productSalesArray
        .sort((a, b) => b.totalSales - a.totalSales)
        .slice(0, 5);

      return {
        data: productSalesArray,
        topProducts,
        totalSales,
        totalProductsSales: totalProductsSold,
        currentMonthSales,
        lastMonthSales,
        salesGrowthPercentage,
      };
    } else {
      // Vous pouvez gérer le cas de données vides comme vous le souhaitez
      return {
        data: [],
        topProducts: [],
        totalSales: 0,
        totalProductsSales: 0,
        currentMonthSales: 0,
        lastMonthSales: 0,
        salesGrowthPercentage: 0,
      };
    }
  } catch (error: any) {
    throw new Error(
      "Erreur lors de la récupération des données pour les produits : " +
        error.message
    );
  }
}
