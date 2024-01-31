"use server";

import { prisma } from "@/lib/prisma";

export async function checkForExistingStripeSession(stripeId: string) {
  const existingSession = await prisma.stripeSession.findFirst({
    where: {
      stripeId,
      isProcessed: false,
    },
  });

  if (existingSession) {
    return existingSession;
  } else {
    return null;
  }
}
