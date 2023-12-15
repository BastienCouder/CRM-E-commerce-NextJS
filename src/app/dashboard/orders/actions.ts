import { prisma } from "@/lib/db/prisma";
import {
  format,
  eachMonthOfInterval,
  startOfMonth,
  subMonths,
  startOfYear,
  endOfYear,
  differenceInDays,
  eachDayOfInterval,
  eachWeekOfInterval,
  addDays,
  addWeeks,
  addMonths,
} from "date-fns";
import { revalidatePath } from "next/cache";
import { CartItemsProps } from "@/lib/db/cart";
import { OrderItemsProps } from "@/lib/db/order";

export interface AnalyticsData {
  date?: string;
  subtotal?: number;
  totalOrders?: number;
  totalNocanceledOrders?: number;
}

export interface useServerReadAnalyticsOrdersProps {
  data: AnalyticsData[];
  maxSubtotal: number;
  maxOrder: number;
  currentMonthSubtotal: number;
  currentMonthOrderCount: number;
  subtotalDifferencePercent: number;
  orderCountDifferencePercent: number;
}

export async function useServerReadAnalyticsOrders(
  startDateParam?: Date,
  endDateParam?: Date
): Promise<useServerReadAnalyticsOrdersProps> {
  try {
    const currentDate = new Date();
    const startDate = startDateParam || startOfYear(currentDate);
    const endDate = endDateParam || endOfYear(currentDate);

    const orderItems = await prisma.orderItems.findMany({
      include: {
        cart: {
          include: {
            cartItems: {
              where: { deleteAt: null },
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
    const daysDifference = differenceInDays(endDate, startDate);
    let intervalFunction = eachMonthOfInterval;

    if (daysDifference <= 1) {
      intervalFunction = eachDayOfInterval;
    } else if (daysDifference <= 7) {
      intervalFunction = eachWeekOfInterval;
    }

    const allIntervals = intervalFunction({
      start: startDate,
      end: endDate,
    });

    let orderItemsData: AnalyticsData[] = allIntervals.map((intervalStart) => {
      let intervalEnd: Date;
      if (intervalFunction === eachDayOfInterval) {
        intervalEnd = addDays(intervalStart, 1);
      } else if (intervalFunction === eachWeekOfInterval) {
        intervalEnd = addWeeks(intervalStart, 1);
      } else {
        intervalEnd = addMonths(intervalStart, 1);
      }

      const intervalOrders = orderItems.filter(
        (orderItem: OrderItemsProps) =>
          new Date(orderItem.createdAt!) >= intervalStart &&
          new Date(orderItem.createdAt!) < intervalEnd
      );

      const activeCartItems = intervalOrders
        .filter((orderItem) => orderItem.deleteAt === null)
        .reduce(
          (items, orderItem) => items.concat(orderItem.cart?.cartItems || []),
          [] as CartItemsProps[]
        );

      const subtotal = calculateSubtotal(activeCartItems);
      const orderCount = intervalOrders.length;
      const noCanceledOrderCount = intervalOrders.filter(
        (orderItem) => orderItem.deleteAt === null
      ).length;

      let dateFormat = "yyyy-MM";
      if (intervalFunction === eachDayOfInterval) {
        dateFormat = "yyyy-MM-dd";
      } else if (intervalFunction === eachWeekOfInterval) {
        dateFormat = "yyyy-'W'Iso";
      }

      return {
        date: format(intervalStart, dateFormat),
        subtotal: subtotal || 0,
        totalOrders: orderCount,
        totalNocanceledOrders: noCanceledOrderCount,
      };
    });

    const maxSubtotal = Math.max(
      ...orderItemsData.map((item) => item.subtotal || 0)
    );

    const maxOrder = Math.max(
      ...orderItemsData.map((item) => item.totalNocanceledOrders || 0)
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

    const currentMonthOrders = orderItems.filter((orderItem) => {
      const createdAtDate = new Date(orderItem.createdAt!);
      return (
        orderItem.deleteAt === null &&
        createdAtDate >= currentMonthStart &&
        createdAtDate <= endDate
      );
    });

    const currentMonthSubtotal = calculateSubtotal(
      currentMonthOrders
        .filter((orderItem) => orderItem.deleteAt === null)
        .reduce(
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
      data: orderItemsData,
      maxSubtotal,
      maxOrder,
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
