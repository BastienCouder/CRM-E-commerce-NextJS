import { prisma } from "./prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { Session } from "next-auth";
import { DeliverySchema } from "@/lib/DbSchema";
import { z } from "zod";

export type DeliveryProps = z.infer<typeof DeliverySchema>;

export async function getDelivery(): Promise<DeliveryProps | null> {
  const session: Session | null = await getServerSession(authOptions);

  let delivery: DeliveryProps | null = null;

  if (session) {
    delivery = await prisma.delivery.findFirst({
      where: {
        userId: session.user.id,
        deleteAt: null,
      },
    });
  }

  if (!delivery) {
    return null;
  }
  return DeliverySchema.parse({
    ...delivery,
  });
}

export async function createDelivery(): Promise<DeliveryProps> {
  const session: Session | null = await getServerSession(authOptions);

  let newDelivery: DeliveryProps;
  if (session) {
    newDelivery = await prisma.delivery.create({
      data: { userId: session.user.id, deleteAt: null },
    });
  } else {
    throw new Error("Aucune session n'est disponible.");
  }

  return DeliverySchema.parse({
    ...newDelivery,
    deliveryItems: [],
  });
}
