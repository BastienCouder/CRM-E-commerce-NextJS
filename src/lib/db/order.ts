import { cookies } from "next/dist/client/components/headers";
import { prisma } from "./prisma";
import { Order, Prisma } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { boolean } from "zod";

export type OrderWithCartDelivery = Prisma.OrderGetPayload<{
  include: {
    orderItems: {
      include: {
        cart: {
          include: {
            cartItems: {
              include: {
                product: true;
              };
            };
          };
        };
        delivery: {
          include: {
            deliveryItems: {
              include: {
                deliveryOption: true;
              };
            };
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
          };
        };
      };
    };
    delivery: {
      include: {
        deliveryItems: {
          include: {
            deliveryOption: true;
          };
        };
      };
    };
  };
}>;

export type ShoppingOrder = OrderWithCartDelivery & {
  ///
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
                  },
                },
              },
            },
            delivery: {
              include: {
                deliveryItems: {
                  include: {
                    deliveryOption: true,
                  },
                },
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
          create: [{ cartId, deliveryId, isPaid: false }],
        },
      },
    });

    //delivery
    await prisma.delivery.findUnique({
      where: {
        id: deliveryId,
        isPaid: false,
      },
      include: { deliveryItems: true },
    });
    await prisma.delivery.update({
      where: {
        id: deliveryId,
        userId: session.user.id,
      },
      data: { isPaid: true },
    });
    //cart
    const del = await prisma.cart.findUnique({
      where: {
        id: cartId,
        isPaid: false,
      },
      include: { cartItems: true },
    });
    const delupdate = await prisma.cart.update({
      where: {
        id: cartId,
        userId: session.user.id,
      },
      data: { isPaid: true },
    });

    const orderWithCart = await prisma.order.findUnique({
      where: {
        id: newOrder.id,
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
            delivery: {
              include: {
                deliveryItems: {
                  include: {
                    deliveryOption: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    return orderWithCart;
  }

  return null;
}
