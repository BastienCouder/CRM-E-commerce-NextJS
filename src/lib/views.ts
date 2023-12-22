import { prisma } from "@/lib/db/prisma";
import { Browser, Device } from "./DbSchema";

export async function recordVisit(url: string) {
  const now = new Date();

  await prisma.detailedVisit.create({
    data: {
      url: url,
      timestamp: now,
    },
  });

  await prisma.aggregatedVisit.upsert({
    where: { url: url },
    update: { count: { increment: 1 } },
    create: { url: url, count: 1 },
  });
}

export async function recordVisitorInfo(
  visitorId: string,
  browserName: Browser,
  osName: string,
  deviceType: Device,
  city: string,
  country: string,
  region: string
) {
  await prisma.visitorInfo.create({
    data: {
      visitorId,
      browser: browserName,
      os: osName,
      deviceType,
      city,
      country,
      region,
    },
  });
}

export async function aggregateAndCleanUpVisits() {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const visitsToAggregate = await prisma.detailedVisit.groupBy({
    by: ["url"],
    _count: {
      id: true,
    },
    where: {
      timestamp: {
        lt: thirtyDaysAgo,
      },
    },
  });

  for (const visit of visitsToAggregate) {
    await prisma.aggregatedVisit.upsert({
      where: { url: visit.url },
      update: { count: { increment: visit._count.id } },
      create: { url: visit.url, count: visit._count.id },
    });

    await prisma.detailedVisit.deleteMany({
      where: {
        url: visit.url,
        timestamp: {
          lt: thirtyDaysAgo,
        },
      },
    });
  }
}
