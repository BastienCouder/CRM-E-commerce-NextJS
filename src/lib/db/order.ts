import { Session, getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { generateOrderNumber } from "@/helpers/utils";
import { prisma } from "@/lib/db/prisma";
import { CartItem, Order, OrderItem } from "../DbSchema";

export type OrderProps = Order & {
  //
};

export async function getOrder(): Promise<OrderProps | null> {
  const session: Session | null = await getServerSession(authOptions);

  let order: OrderProps | null = null;

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
                  },
                },
              },
            },
            deliveryItems: true,
            deliveryOption: true,
          },
        },
      },
    });
  }

  if (order) {
    const orderItemsWithSubtotal = order.orderItems.map((item: OrderItem) => {
      const subtotalOrder =
        item.cart.cartItems.reduce(
          (acc: number, cartItem: CartItem) =>
            acc + cartItem.quantity * cartItem.product.price,
          0
        ) + item.deliveryOption.price;

      const subtotalCart = item.cart.cartItems.reduce(
        (acc: number, cartItem: CartItem) =>
          acc + cartItem.quantity * cartItem.product.price,
        0
      );
      const size = item.cart.cartItems.reduce(
        (acc: number, item: CartItem) => acc + item.quantity,
        0
      );

      return {
        ...item,
        cart: {
          ...item.cart,
          subtotal: subtotalCart,
          size,
        },
        subtotal: subtotalOrder,
      };
    });

    return {
      ...order,
      orderItems: orderItemsWithSubtotal,
    };
  }

  return null;
}
export async function createOrder(): Promise<OrderProps | null> {
  const session: Session | null = await getServerSession(authOptions);

  if (session) {
    const newOrder = await prisma.order.create({
      data: {
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
                  },
                },
              },
            },
          },
        },
      },
    });

    const orderItemsWithSubtotal = newOrder.orderItems.map((item) => {
      const subtotal = item.cart.cartItems.reduce(
        (acc, cartItem) => acc + cartItem.quantity * cartItem.product.price,
        0
      );
      const size = item.cart.cartItems.reduce(
        (acc: number, item: CartItem) => acc + item.quantity,
        0
      );

      return {
        ...item,
        cart: {
          ...item.cart,
          subtotal,
          size,
        },
      };
    });

    return {
      ...newOrder,
      orderItems: orderItemsWithSubtotal,
    };
  }

  return null;
}
