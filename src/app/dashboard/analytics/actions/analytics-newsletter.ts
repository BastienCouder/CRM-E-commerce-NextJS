"use server";
import { getWeekNumber } from "../../../../../format";
import { prisma } from "@/lib/prisma";
import {
  format,
  eachMonthOfInterval,
  startOfYear,
  endOfYear,
  differenceInDays,
  eachDayOfInterval,
  eachWeekOfInterval,
  addDays,
  addWeeks,
  addMonths,
  startOfMonth,
  endOfMonth,
  subMonths,
} from "date-fns";
import { revalidatePath } from "next/cache";

export interface NewsletterAnalytics {
  date: string;
  usersCreatedCount: number;
  newsletterSubscribersCount: number;
}

export interface readAnalyticsNewsletterProps {
  data: NewsletterAnalytics[];
  totalUsers: number;
  totalNewsletterSubscribersCount: number;
  thisMonthUsersCount: number;
  lastMonthUsersCount: number;
  monthlyGrowthPercentage: number;
}
export async function readAnalyticsNewsletter(
  startDateParam?: Date,
  endDateParam?: Date
): Promise<readAnalyticsNewsletterProps> {
  const currentDate = new Date();
  const startDate = startDateParam || startOfYear(currentDate);
  const endDate = endDateParam || endOfYear(currentDate);

  const totalUsers = await prisma.user.count({
    where: { createdAt: { gte: startDate, lt: endDate } },
  });
  const totalNewsletterSubscribersCount = await prisma.user.count({
    where: { newsletter: true, createdAt: { gte: startDate, lt: endDate } },
  });

  const daysDifference = differenceInDays(endDate, startDate);
  const intervalFunction =
    daysDifference <= 14
      ? eachDayOfInterval
      : daysDifference <= 30
      ? eachWeekOfInterval
      : eachMonthOfInterval;
  const allIntervals = intervalFunction({ start: startDate, end: endDate });

  const analyticsData = await Promise.all(
    allIntervals.map(async (intervalStart) => {
      const intervalEnd =
        intervalFunction === eachDayOfInterval
          ? addDays(intervalStart, 1)
          : intervalFunction === eachWeekOfInterval
          ? addWeeks(intervalStart, 1)
          : addMonths(intervalStart, 1);
      const formattedDate =
        intervalFunction === eachDayOfInterval
          ? format(intervalStart, "yyyy-MM-dd")
          : intervalFunction === eachWeekOfInterval
          ? `${intervalStart.getFullYear()}-W${String(
              getWeekNumber(intervalStart)
            ).padStart(2, "0")}`
          : format(intervalStart, "yyyy-MM");

      const usersCreatedCount = await prisma.user.count({
        where: { createdAt: { gte: intervalStart, lt: intervalEnd } },
      });
      const newsletterSubscribersCount = await prisma.user.count({
        where: {
          newsletter: true,
          createdAt: { gte: intervalStart, lt: intervalEnd },
        },
      });

      return {
        date: formattedDate,
        usersCreatedCount,
        newsletterSubscribersCount,
      };
    })
  );

  // Calculer le nombre d'utilisateurs créés ce mois-ci et le mois dernier
  const thisMonthStart = startOfMonth(currentDate);
  const thisMonthEnd = endOfMonth(currentDate);
  const lastMonthStart = startOfMonth(subMonths(currentDate, 1));
  const lastMonthEnd = endOfMonth(subMonths(currentDate, 1));

  const thisMonthUsersCount = await prisma.user.count({
    where: { createdAt: { gte: thisMonthStart, lt: thisMonthEnd } },
  });
  const lastMonthUsersCount = await prisma.user.count({
    where: { createdAt: { gte: lastMonthStart, lt: lastMonthEnd } },
  });

  // Calcul du pourcentage de croissance
  const monthlyGrowthPercentage =
    lastMonthUsersCount === 0
      ? thisMonthUsersCount === 0
        ? 0
        : 100
      : ((thisMonthUsersCount - lastMonthUsersCount) / lastMonthUsersCount) *
        100;

  revalidatePath("/dashboard");

  return {
    data: analyticsData,
    totalUsers,
    totalNewsletterSubscribersCount,
    thisMonthUsersCount,
    lastMonthUsersCount,
    monthlyGrowthPercentage,
  };
}
