import { Prisma } from "@prisma/client";
import { Session, getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { PrismaClient } from "@prisma/client";
import { generateOrderNumber } from "../../helpers/utils";

const prisma = new PrismaClient();

export type OrderWithOrderItemsProps = Prisma.OrderGetPayload<{
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

export type OrderItemsProps = Prisma.OrderItemsGetPayload<{
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

export type OrderProps = OrderWithOrderItemsProps & {
  //
};

export async function getOrder(): Promise<OrderProps | null> {
  const session: Session | null = await getServerSession(authOptions);

  let order: OrderWithOrderItemsProps | null = null;

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
                  where: { deleteAt: null },
                  include: {
                    product: true,
                    variant: true,
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
  }

  return order as OrderProps;
}

export async function createOrder(
  cartId: string,
  deliveryId: string
): Promise<OrderProps | null> {
  const session: Session | null = await getServerSession(authOptions);

  if (session) {
    const orderNumber: string = generateOrderNumber();

    const newOrder: OrderProps = await prisma.order.create({
      data: {
        userId: session.user.id,
        orderItems: {
          create: [
            {
              cartId,
              deliveryItemsId: deliveryId,
              orderNumber,
              deleteAt: null,
            },
          ],
        },
      },
      include: {
        orderItems: {
          include: {
            cart: {
              include: {
                cartItems: {
                  where: { deleteAt: null },
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
