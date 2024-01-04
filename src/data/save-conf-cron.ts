"use server";

import { prisma } from "@/lib/prisma";

type ICronConfig = {
  id: string;
  type: string;
  value: string;
};
export async function saveCronConfig(
  id: string,
  type: string,
  cronString: string
): Promise<ICronConfig> {
  const result = await prisma.cronConfig.upsert({
    where: { id },
    update: { type, value: cronString },
    create: { id, type, value: cronString },
  });

  return {
    id: result.id,
    type: result.type,
    value: result.value,
  };
}

export async function getCronConfig(id: string): Promise<ICronConfig | null> {
  const config = await prisma.cronConfig.findUnique({
    where: { id },
  });

  if (config) {
    return {
      id: config.id,
      type: config.type,
      value: config.value,
    };
  } else {
    return null;
  }
}
