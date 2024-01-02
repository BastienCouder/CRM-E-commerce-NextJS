"use server";

import { getVisitorInfo } from "@/lib/db/visitorInfo";
import { DetailedVisit } from "@prisma/client";
import {
  startOfMonth,
  subMonths,
  differenceInDays,
  eachDayOfInterval,
  eachWeekOfInterval,
  eachMonthOfInterval,
  addDays,
  addWeeks,
  addMonths,
  format,
  getISOWeek,
  endOfMonth,
} from "date-fns";

type Statistic = {
  count: number;
  percentage: number;
};

type readAnalyticsVisitorInfosProps = {
  devices: Record<string, Statistic>;
  browsers: Record<string, Statistic>;
  os: Record<string, Statistic>;
};

export async function readAnalyticsVisitorInfos(): Promise<readAnalyticsVisitorInfosProps> {
  const visitorInfos = await getVisitorInfo();

  if (!visitorInfos) {
    throw new Error("No visitor info available");
  }

  // Initialisation des statistiques
  let deviceStats: Record<string, number> = {};
  let browserStats: Record<string, number> = {};
  let osStats: Record<string, number> = {};

  // Compter les occurrences
  visitorInfos.forEach((visitor) => {
    deviceStats[visitor.deviceType] =
      (deviceStats[visitor.deviceType] || 0) + 1;
    browserStats[visitor.browser!] = (browserStats[visitor.browser!] || 0) + 1;
    osStats[visitor.os] = (osStats[visitor.os] || 0) + 1;
  });

  // Convertir les comptes en statistiques
  const totalVisitors = visitorInfos.length;
  const calculatePercentages = (
    stats: Record<string, number>
  ): Record<string, Statistic> =>
    Object.keys(stats).reduce((acc, key) => {
      acc[key] = {
        count: stats[key],
        percentage: (stats[key] / totalVisitors) * 100,
      };
      return acc;
    }, {} as Record<string, Statistic>);

  return {
    devices: calculatePercentages(deviceStats),
    browsers: calculatePercentages(browserStats),
    os: calculatePercentages(osStats),
  };
}

export interface AnalyticsVisitedData {
  date: string;
  totalVisits: number;
}

export interface ReadAnalyticsVisitedProps {
  data: AnalyticsVisitedData[];
  maxVisits: number;
  currentMonthVisits: number;
  visitDifferencePercent: number;
}

export async function readAnalyticsVisited(
  startDateParam?: Date,
  endDateParam?: Date
): Promise<ReadAnalyticsVisitedProps> {
  try {
    const currentDate = new Date();
    const startDate = startDateParam || startOfMonth(currentDate);
    const endDate = endDateParam || currentDate;

    // Ici, récupérez vos données de visites détaillées depuis la base de données
    const detailedVisits: DetailedVisit[] = []; // Remplacez par la récupération réelle de données

    const daysDifference = differenceInDays(endDate, startDate);
    let intervalFunction: (interval: { start: Date; end: Date }) => Date[];

    if (daysDifference <= 7) {
      intervalFunction = eachDayOfInterval;
    } else if (daysDifference <= 30) {
      intervalFunction = eachWeekOfInterval;
    } else {
      intervalFunction = eachMonthOfInterval;
    }

    const allIntervals = intervalFunction({ start: startDate, end: endDate });

    let visitedData: AnalyticsVisitedData[] = allIntervals.map(
      (intervalStart: Date) => {
        let intervalEnd: Date;
        let formattedDate: string;

        if (intervalFunction === eachDayOfInterval) {
          intervalEnd = addDays(intervalStart, 1);
          formattedDate = format(intervalStart, "yyyy-MM-dd");
        } else if (intervalFunction === eachWeekOfInterval) {
          intervalEnd = addWeeks(intervalStart, 1);
          formattedDate = `W${getISOWeek(intervalStart)}`;
        } else {
          intervalEnd = addMonths(intervalStart, 1);
          formattedDate = format(intervalStart, "yyyy-MM");
        }

        const intervalVisits = detailedVisits.filter((visit) => {
          const visitDate = new Date(visit.timestamp);
          return visitDate >= intervalStart && visitDate < intervalEnd;
        });

        return {
          date: formattedDate,
          totalVisits: intervalVisits.length,
        };
      }
    );

    const maxVisits = Math.max(...visitedData.map((item) => item.totalVisits));

    // Calculer les visites pour le mois en cours
    const currentMonthStart = startOfMonth(new Date());
    const currentMonthEnd = endOfMonth(new Date());
    const currentMonthVisits = detailedVisits.filter((visit) => {
      const visitDate = new Date(visit.timestamp);
      return visitDate >= currentMonthStart && visitDate <= currentMonthEnd;
    }).length;

    // Calculer les visites pour le mois précédent
    const lastMonthStart = startOfMonth(subMonths(new Date(), 1));
    const lastMonthEnd = endOfMonth(subMonths(new Date(), 1));
    const lastMonthVisits = detailedVisits.filter((visit) => {
      const visitDate = new Date(visit.timestamp);
      return visitDate >= lastMonthStart && visitDate <= lastMonthEnd;
    }).length;

    // Calculer le pourcentage de différence
    let visitDifferencePercent = 0;
    if (lastMonthVisits > 0) {
      visitDifferencePercent =
        ((currentMonthVisits - lastMonthVisits) / lastMonthVisits) * 100;
    } else if (currentMonthVisits > 0) {
      visitDifferencePercent = 100;
    }

    return {
      data: visitedData,
      maxVisits,
      currentMonthVisits,
      visitDifferencePercent,
    };
  } catch (error: any) {
    throw new Error(
      "Erreur lors de la récupération des données de visite : " + error.message
    );
  }
}
