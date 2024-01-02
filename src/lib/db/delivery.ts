import { prisma } from "../prisma";
import { Delivery } from "@/schemas/DbSchema";
import { auth } from "@/auth";

export type DeliveryProps = Delivery & {
  ///...
};

export async function getDelivery(): Promise<DeliveryProps | null> {
  const session = await auth();

  let delivery: DeliveryProps | null = null;

  if (session) {
    delivery = await prisma.delivery.findFirst({
      where: {
        userId: session.user.id,
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
  const session = await auth();

  if (!session) {
    throw new Error("Aucune session n'est disponible.");
  }

  const newDelivery = await prisma.delivery.create({
    data: { userId: session.user.id },
  });

  return {
    ...newDelivery,
    deliveryItems: [],
  };
}
