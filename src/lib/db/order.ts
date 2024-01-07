"use server";
import { prisma } from "@/lib/prisma";
import { CartItem, Order, OrderItem } from "../../schemas/DbSchema";
import { currentUser } from "@/lib/auth";

export type OrderProps = Order & {
  //
};

export async function getOrder(): Promise<OrderProps | null> {
  const session = await currentUser();

  let order: OrderProps | null = null;

  if (session) {
    order = await prisma.order.findFirst({
      where: {
        userId: session.id,
      },
      include: {
        orderItems: {
          where: { isPaid: true },
          orderBy: {
            createdAt: "desc",
          },
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
  const session = await currentUser();

  if (session) {
    const newOrder = await prisma.order.create({
      data: {
        userId: session.id,
      },
      include: {
        orderItems: {
          where: { isPaid: false },
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
