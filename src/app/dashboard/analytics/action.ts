import { getVisitorInfo } from "@/lib/db/visitorInfo";

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
