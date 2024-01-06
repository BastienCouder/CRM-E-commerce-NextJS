"use server";
import { prisma } from "@/lib/prisma";
import { Cron } from "@/schemas/DbSchema";

export type CronProps = Cron & {
  ///
};

export async function getCrons(): Promise<CronProps[] | null> {
  try {
    const crons = await prisma.cronConfig.findMany();

    return crons;
  } catch (error) {
    console.error("Error while retrieving users:", error);
    return null;
  }
}
