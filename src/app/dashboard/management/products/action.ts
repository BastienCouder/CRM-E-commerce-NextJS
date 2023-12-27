"use server";
import { prisma } from "@/lib/db/prisma";
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

    revalidatePath("/[lang]/dashboard", "layout");

    return {
      data: productSalesArray,
      topProducts,
      totalSales,
      totalProductsSales: totalProductsSold,
      currentMonthSales,
      lastMonthSales,
      salesGrowthPercentage,
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

// export async function useServerNewPriorityToRecentProducts() {
//   const oneMonthAgo = new Date();
//   oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 2);

//   const allProducts = await prisma.product.findMany();

//   const updatePromises = allProducts.map((product: Product) => {
//     const wasCreatedLastMonth = product.createdAt! >= oneMonthAgo;
//     let newPriority;

//     if (wasCreatedLastMonth) {
//       newPriority = Array.from(new Set([...product?.priority, "new"]));
//     } else {
//       newPriority = product.priority.filter((p) => p !== "new");
//     }

//     return prisma.product.update({
//       where: { id: product.id },
//       data: { priority: { set: newPriority } },
//     });
//   });

//   await Promise.all(updatePromises);
// }

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

    revalidatePath(`/dashboard`);

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
