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
            SoftDelete: false,
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
  const session = await getServerSession(authOptions);

  let newDelivery: Delivery;
  if (session) {
    newDelivery = await prisma.delivery.create({
      data: { userId: session.user.id },
    });
  } else {
    newDelivery = await prisma.delivery.create({
      data: {},
    });
  }

  cookies().set("localDeliveryId", newDelivery.id);

  return {
    ...newDelivery,
    deliveryItems: [],
  };
}

// export async function mergeAnonymousDeliveryIntoUserCart(userId: string) {
//   const localDeliveryId = cookies().get("localDeliveryId")?.value;

//   const localDelivery = localDeliveryId
//     ? await prisma.delivery.findUnique({
//         where: { id: localDeliveryId },
//         include: { deliveryItems: true },
//       })
//     : null;

//   if (!localDelivery) {
//     return;
//   }

//   const userDelivery = await prisma.delivery.findFirst({
//     where: { userId },
//     include: { deliveryItems: true },
//   });

//   await prisma.$transaction(async (tx) => {
//     if (userDelivery) {
//       const mergedDeliveryItems = mergeDeliveryItems(
//         localDelivery.deliveryItems,
//         userDelivery.deliveryItems
//       );

//       await tx.deliveryItems.deleteMany({
//         where: { deliveryId: userDelivery.id },
//       });

//       await tx.deliveryItems.createMany({
//         data: mergedDeliveryItems.map((item) => ({
//           deliveryId: userDelivery.id,
//           deliveryOptionId: item.deliveryOptionId,
//           name: item.name,
//           surname: item.surname,
//           email: item.email,
//           city: item.city,
//           tel: item.tel,
//           address: item.address,
//           country: item.country,
//           postcode: item.postcode,
//         })),
//       });
//     } else {
//       await tx.delivery.create({
//         data: {
//           userId,
//           deliveryItems: {
//             createMany: {
//               data: localDelivery.deliveryItems.map((item) => ({
//                 deliveryOptionId: item.deliveryOptionId,
//                 name: item.name,
//                 surname: item.surname,
//                 email: item.email,
//                 city: item.city,
//                 tel: item.tel,
//                 address: item.address,
//                 country: item.country,
//                 postcode: item.postcode,
//               })),
//             },
//           },
//         },
//       });
//     }
//     await tx.cart.delete({
//       where: { id: localDelivery.id },
//     });

//     cookies().set("localDeliveryId", "");
//   });
// }

// function mergeDeliveryItems(...deliveryItems: DeliveryItems[][]) {
//   return deliveryItems.reduce((acc, items) => {
//     items.forEach((item) => {
//       const existingItem = acc.find((i) => i.email === item.email);
//       if (existingItem) {
//         return;
//       } else {
//         acc.push(item);
//       }
//     });
//     return acc;
//   }, [] as DeliveryItems[]);
// }
