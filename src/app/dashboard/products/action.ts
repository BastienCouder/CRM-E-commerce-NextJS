import { prisma } from "@/lib/db/prisma";
import { env } from "@/lib/env";
import { revalidatePath } from "next/cache";

export interface AnalyticsData {
  date: Date;
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
            date: new Date(orderItem.createdAt!),
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

interface ProductAnalytics {
  productId: string;
  name: string;
  nameVariant?: string;
  wishlistCount: number;
  cartCount: number;
  orderCount: number;
  date: Date;
}

export interface UseServerReadAnalyticsWishlistCartOrderProps {
  data: ProductAnalytics[];
}

export async function useServerReadAnalyticsWishlistCartOrder(): Promise<UseServerReadAnalyticsWishlistCartOrderProps> {
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
                  variant: true,
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

    let productAnalyticsMap: Record<string, ProductAnalytics> = {};

    orderItems.forEach(({ cart }) => {
      cart.cartItems.forEach(({ product, variant }) => {
        const productId = product.id;
        if (!productAnalyticsMap[productId]) {
          productAnalyticsMap[productId] = {
            productId,
            name: product.name + (variant ? ` (${variant.name})` : ""),
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
      let product, variant;
      const idKey = item.variantId || item.productId;

      if (item.variantId) {
        variant = await prisma.productVariant.findUnique({
          where: { id: item.variantId },
        });
        product = await prisma.product.findUnique({
          where: { id: variant?.productId! },
        });
      } else {
        product = await prisma.product.findUnique({
          where: { id: item.productId },
        });
      }

      productAnalyticsMap[idKey] = productAnalyticsMap[idKey] || {
        productId: idKey,
        name: product?.name + (variant ? ` (${variant.name})` : ""),
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
