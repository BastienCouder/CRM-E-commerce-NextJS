import { prisma } from "@/lib/db/prisma";
import { format, eachMonthOfInterval, startOfMonth, subMonths } from "date-fns";
import { revalidatePath } from "next/cache";
import { CartItemsProps } from "@/lib/db/cart";
import { OrderItemsProps } from "@/lib/db/order";
import { env } from "@/lib/env";

export interface AnalyticsData {
  date?: string;
  orderItems?: number;
  subtotal?: number;
}

export interface useServerReadAnalyticsSaleProps {
  Data: AnalyticsData[];
  maxSubtotal: number;
  maxOrderItems: number;
  currentMonthSubtotal: number;
  currentMonthOrderCount: number;
  subtotalDifferencePercent: number;
  orderCountDifferencePercent: number;
}

export async function useServerReadAnalyticsSale(): Promise<useServerReadAnalyticsSaleProps> {
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
                variant: true,
              },
            },
          },
        },
        deliveryItems: {
          include: {
            deliveryOption: true,
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

    const allMonths = eachMonthOfInterval({
      start: startDate,
      end: endDate,
    });

    const orderItemsData: AnalyticsData[] = allMonths.map((month) => {
      const monthEndDate = new Date(month);
      monthEndDate.setMonth(monthEndDate.getMonth() + 1);

      const filteredOrders = orderItems.filter(
        (orderItem: OrderItemsProps) =>
          new Date(orderItem.createdAt!) >= month &&
          new Date(orderItem.createdAt!) < monthEndDate
      );

      const cartItems = filteredOrders.reduce(
        (items, orderItem) => items.concat(orderItem.cart?.cartItems || []),
        [] as CartItemsProps[]
      );

      const subtotal = calculateSubtotal(cartItems);

      return {
        date: format(month, "yyyy-MM-dd"),
        orderItems: filteredOrders.length,
        subtotal: subtotal || 0,
      };
    });

    const maxSubtotal = Math.max(
      ...orderItemsData.map((item) => item.subtotal || 0)
    );

    const maxOrderItems = Math.max(
      ...orderItemsData.map((item) => item.orderItems || 0)
    );

    const lastMonthStart = startOfMonth(subMonths(new Date(), 1));
    const lastMonthEnd = startOfMonth(new Date());

    const lastMonthOrders = orderItems.filter(
      (orderItem) =>
        new Date(orderItem.createdAt!) >= lastMonthStart &&
        new Date(orderItem.createdAt!) < lastMonthEnd
    );

    const lastMonthSubtotal = calculateSubtotal(
      lastMonthOrders.reduce(
        (items, orderItem) => items.concat(orderItem.cart?.cartItems || []),
        [] as CartItemsProps[]
      )
    );

    const lastMonthOrderCount = lastMonthOrders.length;

    const currentMonthStart = startOfMonth(new Date());
    const currentMonthOrders = orderItems.filter(
      (orderItem) =>
        new Date(orderItem.createdAt!) >= currentMonthStart &&
        new Date(orderItem.createdAt!) <= endDate
    );

    const currentMonthSubtotal = calculateSubtotal(
      currentMonthOrders.reduce(
        (items, orderItem) => items.concat(orderItem.cart?.cartItems || []),
        [] as CartItemsProps[]
      )
    );

    const currentMonthOrderCount = currentMonthOrders.length;

    const subtotalDifferencePercent = calculatePercentageDifference(
      lastMonthSubtotal,
      currentMonthSubtotal
    );
    const orderCountDifferencePercent = calculatePercentageDifference(
      lastMonthOrderCount,
      currentMonthOrderCount
    );

    revalidatePath(`/dashboard`);
    revalidatePath(`/dashboard/orders`);

    return {
      Data: orderItemsData,
      maxSubtotal,
      maxOrderItems,
      currentMonthSubtotal,
      currentMonthOrderCount,
      subtotalDifferencePercent,
      orderCountDifferencePercent,
    };
  } catch (error: any) {
    throw new Error(
      "Erreur lors de la récupération des données pour le graphique : " +
        error.message
    );
  } finally {
    await prisma.$disconnect();
  }
}

function calculateSubtotal(cartItems: CartItemsProps[]): number {
  return cartItems.reduce((acc, item) => {
    const variantPrice = item.variant?.price || 0;
    const productPrice = item.product?.price || 0;
    const price = variantPrice || productPrice || 0;
    return acc + item.quantity * price;
  }, 0);
}

function calculatePercentageDifference(
  previous: number,
  current: number
): number {
  if (previous === 0) {
    return current !== 0 ? 100 : 0;
  }
  return ((current - previous) / previous) * 100;
}
