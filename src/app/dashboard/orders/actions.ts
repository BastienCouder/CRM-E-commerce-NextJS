import { prisma } from "@/lib/db/prisma";
import { startOfMonth, subMonths, format, eachMonthOfInterval } from "date-fns";
import { revalidatePath } from "next/cache";
import { OrderProps } from "../lib/db/orders";
import { CartItemsProps } from "@/lib/db/cart";
import { OrderItemsProps } from "@/lib/db/order";

interface AnalyticsData {
  date: string;
  orderItems?: number;
  subtotal?: number;
}

export interface useServerReadAnalyticsSaleProps {
  Data: AnalyticsData[];
  maxTotal: number;
}

export async function useServerReadAnalyticsSale(): Promise<useServerReadAnalyticsSaleProps> {
  try {
    const endDate = new Date();
    const startDate = subMonths(endDate, 11);

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

    const maxTotal = Math.max(
      ...orderItemsData.map((item) => item.subtotal || 0)
    );

    revalidatePath(`/dashboard`);

    return {
      Data: orderItemsData,
      maxTotal,
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
