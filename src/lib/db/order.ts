import {
  Prisma,
  Order,
  Cart,
  Delivery,
  DeliveryOption,
  User,
} from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export type OrderWithCartDelivery = Prisma.OrderGetPayload<{
  include: {
    orderItems: {
      include: {
        cart: {
          include: {
            cartItems: {
              include: {
                product: true;
                variant: true;
              };
            };
          };
        };

        deliveryItems: {
          include: {
            deliveryOption: true;
          };
        };
      };
    };
  };
}>;

export type OrderItemWithCartDelivery = Prisma.OrderItemsGetPayload<{
  include: {
    cart: {
      include: {
        cartItems: {
          include: {
            product: true;
            variant: true;
          };
        };
      };
    };

    deliveryItems: {
      include: {
        deliveryOption: true;
      };
    };
  };
}>;

export type ShoppingOrder = OrderWithCartDelivery & {
  //
};

export async function getOrder(): Promise<ShoppingOrder | null> {
  const session = await getServerSession(authOptions);

  let order: OrderWithCartDelivery | null = null;

  if (session) {
    order = await prisma.order.findFirst({
      where: {
        userId: session.user.id,
      },
      include: {
        orderItems: {
          include: {
            cart: {
              include: {
                cartItems: {
                  include: {
                    product: true,
                    variant: true,
                  },
                },
              },
            },

            deliveryItems: {
              where: {
                OR: [{ SoftDelete: true }, { SoftDelete: false }],
              },
              include: {
                deliveryOption: true,
              },
            },
          },
        },
      },
    });
  }

  return order as ShoppingOrder;
}

export async function createOrder(
  cartId: string,
  deliveryId: string
): Promise<ShoppingOrder | null> {
  const session = await getServerSession(authOptions);

  if (session) {
    const newOrder = await prisma.order.create({
      data: {
        userId: session.user.id,
        orderItems: {
          create: [{ cartId, deliveryItemsId: deliveryId, isPaid: false }],
        },
      },
      include: {
        orderItems: {
          include: {
            cart: {
              include: {
                cartItems: {
                  include: {
                    product: true,
                  },
                },
              },
            },

            deliveryItems: {
              include: {
                deliveryOption: true,
              },
            },
          },
        },
      },
    });

    return newOrder;
  }

  return null;
}
