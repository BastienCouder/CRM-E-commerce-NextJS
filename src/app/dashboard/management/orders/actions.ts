"use server";
import { CartItem, OrderItem } from "@/lib/DbSchema";
import { getOrderItems } from "@/lib/db/orderItem";
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

export interface AnalyticsOrdersData {
  date: string;
  subtotal: number;
  totalOrders: number;
  totalNocanceledOrders: number;
}

export interface readAnalyticsOrdersProps {
  data: AnalyticsOrdersData[];
  maxSubtotal: number;
  maxOrder: number;
  currentMonthSubtotal: number;
  currentMonthOrderCount: number;
  subtotalDifferencePercent: number;
  orderCountDifferencePercent: number;
}

export async function readAnalyticsOrders(
  startDateParam?: Date,
  endDateParam?: Date
): Promise<readAnalyticsOrdersProps> {
  try {
    const currentDate = new Date();
    const startDate = startDateParam || startOfYear(currentDate);
    const endDate = endDateParam || endOfYear(currentDate);

    const orderItems = await getOrderItems(startDate, endDate);
    console.log(orderItems);

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

    let orderItemsData: AnalyticsOrdersData[] = allIntervals.map(
      (intervalStart) => {
        let intervalEnd: Date;
        if (intervalFunction === eachDayOfInterval) {
          intervalEnd = addDays(intervalStart, 1);
        } else if (intervalFunction === eachWeekOfInterval) {
          intervalEnd = addWeeks(intervalStart, 1);
        } else {
          intervalEnd = addMonths(intervalStart, 1);
        }

        const intervalOrders = orderItems?.filter(
          (orderItem: OrderItem) =>
            new Date(orderItem.createdAt!) >= intervalStart &&
            new Date(orderItem.createdAt!) < intervalEnd
        );

        const activeCartItems =
          intervalOrders &&
          intervalOrders
            .filter((orderItem: OrderItem) => orderItem.deleteAt === null)
            .reduce(
              (items: OrderItem, orderItem: OrderItem) =>
                items.concat(orderItem.subtotal || []),
              [] as OrderItem[]
            );

        const subtotal = activeCartItems;
        const orderCount = intervalOrders?.length!;
        const noCanceledOrderCount = intervalOrders?.filter(
          (orderItem) => orderItem.deleteAt === null
        ).length!;

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
      }
    );

    const maxSubtotal = Math.max(
      ...orderItemsData.map((item) => item.subtotal || 0)
    );

    const maxOrder = Math.max(
      ...orderItemsData.map((item) => item.totalNocanceledOrders || 0)
    );
    const lastMonthStart = startOfMonth(subMonths(new Date(), 1));
    const lastMonthEnd = startOfMonth(new Date());

    const lastMonthOrders = orderItems?.filter(
      (orderItem) =>
        new Date(orderItem.createdAt!) >= lastMonthStart &&
        new Date(orderItem.createdAt!) < lastMonthEnd
    );

    const lastMonthSubtotal = lastMonthOrders?.reduce(
      (items, orderItem) => items.concat(orderItem.subtotal || []),
      [] as CartItem[]
    );

    const lastMonthOrderCount = lastMonthOrders?.length!;

    const currentMonthStart = startOfMonth(new Date());

    const currentMonthOrders = orderItems?.filter((orderItem) => {
      const createdAtDate = new Date(orderItem.createdAt!);
      return (
        orderItem.deleteAt === null &&
        createdAtDate >= currentMonthStart &&
        createdAtDate <= endDate
      );
    });

    const currentMonthSubtotal =
      currentMonthOrders &&
      currentMonthOrders
        .filter((orderItem: OrderItem) => orderItem.deleteAt === null)
        .reduce(
          (items: OrderItem, orderItem: OrderItem) =>
            items.concat(orderItem.subtotal || []),
          [] as CartItem[]
        );

    const currentMonthOrderCount = currentMonthOrders?.length!;

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

function calculatePercentageDifference(
  previous: number,
  current: number
): number {
  if (previous === 0) {
    return current !== 0 ? 100 : 0;
  }
  return ((current - previous) / previous) * 100;
}
