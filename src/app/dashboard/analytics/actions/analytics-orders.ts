"use server";

import { getWeekNumber } from "../../../../lib/helpers/format";
import { CartItem, OrderItem } from "@/schemas/db-schema";
import { getOrderItems } from "@/lib/db/orderItem";
import {
  format,
  eachMonthOfInterval,
  startOfMonth,
  subMonths,
  differenceInDays,
  eachDayOfInterval,
  eachWeekOfInterval,
  addDays,
  addWeeks,
  addMonths,
} from "date-fns";

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
    // Définir les dates de début et de fin
    const currentDate = new Date();
    const startDate = startDateParam || startOfMonth(currentDate);
    const endDate = endDateParam || currentDate;

    // Récupérer les éléments de commande
    const orderItems = await getOrderItems(startDate, endDate);

    const daysDifference = differenceInDays(endDate, startDate);

    let intervalFunction: (interval: { start: Date; end: Date }) => Date[];
    if (daysDifference <= 14) {
      intervalFunction = eachDayOfInterval;
    } else if (daysDifference <= 30) {
      intervalFunction = eachWeekOfInterval;
    } else {
      intervalFunction = eachMonthOfInterval;
    }

    const allIntervals = intervalFunction({ start: startDate, end: endDate });

    let orderItemsData: AnalyticsOrdersData[] = allIntervals.map(
      (intervalStart: Date) => {
        let intervalEnd: Date;
        let formattedDate: string;

        if (intervalFunction === eachDayOfInterval) {
          intervalEnd = addDays(intervalStart, 1);
          formattedDate = format(intervalStart, "yyyy-MM-dd");
        } else if (intervalFunction === eachWeekOfInterval) {
          intervalEnd = addWeeks(intervalStart, 1);
          const weekNumber = getWeekNumber(intervalStart);
          formattedDate = `${intervalStart.getFullYear()}-W${String(
            weekNumber
          ).padStart(2, "0")}`;
        } else {
          intervalEnd = addMonths(intervalStart, 1);
          formattedDate = format(intervalStart, "yyyy-MM");
        }

        const intervalOrders: any = orderItems?.filter(
          (orderItem: OrderItem) => {
            const createdAt = new Date(orderItem.createdAt);
            return createdAt >= intervalStart && createdAt < intervalEnd;
          }
        );
        // Calculer le subtotal pour l'intervalle
        const subtotal =
          intervalOrders &&
          intervalOrders
            .filter((orderItem: OrderItem) => orderItem.deleteAt === null)
            .reduce(
              (sum: number, orderItem: OrderItem) =>
                sum + (orderItem.subtotal || 0),
              0
            );

        // Retourner les données pour l'intervalle
        return {
          date: formattedDate,
          subtotal,
          totalOrders: intervalOrders?.length,
          totalNocanceledOrders: intervalOrders?.filter(
            (orderItem: OrderItem) => orderItem.deleteAt === null
          ).length,
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

    // Retourner les données seulement si elles ne sont pas vides
    if (orderItemsData.length > 0) {
      return {
        data: orderItemsData,
        maxSubtotal,
        maxOrder,
        currentMonthSubtotal,
        currentMonthOrderCount,
        subtotalDifferencePercent,
        orderCountDifferencePercent,
      };
    } else {
      // Vous pouvez gérer le cas de données vides comme vous le souhaitez
      console.error(
        "Aucune donnée de commande trouvée pour la période spécifiée."
      );
      return {
        data: [],
        maxSubtotal: 0,
        maxOrder: 0,
        currentMonthSubtotal: 0,
        currentMonthOrderCount: 0,
        subtotalDifferencePercent: 0,
        orderCountDifferencePercent: 0,
      };
    }
  } catch (error: any) {
    throw new Error(
      "Erreur lors de la récupération des données pour le graphique : " +
        error.message
    );
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
