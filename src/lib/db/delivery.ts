import { cookies } from "next/dist/client/components/headers";
import { prisma } from "./prisma";
import { Prisma, Delivery } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { Session } from "next-auth";

export type DeliveryWithdeliveryItemsProps = Prisma.DeliveryGetPayload<{
  include: {
    deliveryItems: { include: { deliveryOption: true } };
  };
}>;

export type DeliveryItemsProps = Prisma.DeliveryItemsGetPayload<{
  include: { deliveryOption: true };
}>;

export type DeliveryProps = DeliveryWithdeliveryItemsProps & {
  ///...
};

export async function getDelivery(): Promise<DeliveryProps | null> {
  const session: Session | null = await getServerSession(authOptions);

  let delivery: DeliveryWithdeliveryItemsProps | null = null;

  if (session) {
    delivery = await prisma.delivery.findFirst({
      where: {
        userId: session.user.id,
        deleteAt: null,
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
  } else {
    const localDeliveryId = cookies().get("localDeliveryId")?.value;
    delivery = localDeliveryId
      ? await prisma.delivery.findUnique({
          where: { id: localDeliveryId },
          include: {
            deliveryItems: {
              include: { deliveryOption: true },
            },
          },
        })
      : null;
  }

  if (!delivery) {
    return null;
  }

  return {
    ...delivery,
  };
}

export async function createDelivery(): Promise<DeliveryProps> {
  const session: Session | null = await getServerSession(authOptions);

  let newDelivery: Delivery;
  if (session) {
    newDelivery = await prisma.delivery.create({
      data: { userId: session.user.id, deleteAt: null },
    });
  } else {
    newDelivery = await prisma.delivery.create({
      data: { deleteAt: null },
    });
  }

  cookies().set("localDeliveryId", newDelivery.id);

  return {
    ...newDelivery,
    deliveryItems: [],
  };
}
