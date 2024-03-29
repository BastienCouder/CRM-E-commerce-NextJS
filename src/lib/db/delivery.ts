"use server";
import { prisma } from "../prisma";
import { Delivery } from "@/schemas/db-schema";
import { auth } from "@/auth";
import { currentUser } from "@/lib/auth";

export type DeliveryProps = Delivery & {
  ///...
};

export async function getDelivery(): Promise<DeliveryProps | null> {
  const session = await currentUser();

  let delivery: DeliveryProps | null = null;

  if (session) {
    delivery = await prisma.delivery.findFirst({
      where: {
        userId: session.id,
      },
      include: {
        deliveryItems: {
          where: {
            deleteAt: null,
          },
        },
      },
    });
  }
  if (!delivery) {
    return null;
  }

  return {
    ...delivery,
  };
}

export async function createDelivery(): Promise<DeliveryProps> {
  const session = await currentUser();

  if (!session) {
    throw new Error("Aucune session n'est disponible.");
  }

  const newDelivery = await prisma.delivery.create({
    data: { userId: session.id },
  });

  return {
    ...newDelivery,
    deliveryItems: [],
  };
}
