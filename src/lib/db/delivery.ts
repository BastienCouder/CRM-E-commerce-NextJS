import { cookies } from "next/dist/client/components/headers";
import { prisma } from "./prisma";
import { Prisma, Delivery } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export type DeliveryWithdeliveryItems = Prisma.DeliveryGetPayload<{
  include: {
    deliveryItems: { include: { deliveryOption: true } };
  };
}>;

export type DeliveryItemWithdeliveryOption = Prisma.DeliveryItemsGetPayload<{
  include: { deliveryOption: true };
}>;

export type DeliveryProps = DeliveryWithdeliveryItems & {
  ///...
};

export async function getDelivery(): Promise<DeliveryProps | null> {
  const session = await getServerSession(authOptions);

  let delivery: DeliveryWithdeliveryItems | null = null;

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
          include: {
            deliveryOption: true,
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
  const session = await getServerSession(authOptions);

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
