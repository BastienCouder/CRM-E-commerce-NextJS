import { prisma } from "@/lib/db/prisma";

export async function pageVisit(url: string) {
  try {
    const page = await prisma.pageVisit.upsert({
      where: { url: url },
      update: { visits: { increment: 1 }, lastVisit: new Date() },
      create: { url: url, visits: 1 },
    });
    return;
  } catch (error) {
    console.log("Error updating page visit:", error);
  }
}
