"use server";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/db/prisma";
import { OrderItem } from "@/lib/DbSchema";

export type OrderProps = OrderItem & {
  ///
  subtotal: number;
};

export async function getOrderItems(
  startDate?: Date,
  endDate?: Date
): Promise<OrderProps[] | null> {
  const session = await getServerSession(authOptions);
  if (session && session.user.role === "ADMIN") {
    try {
      const orders = await prisma.orderItems.findMany({
        where: {
          createdAt: {
            gte: startDate,
            lt: endDate,
          },
        },
        include: {
          cart: {
            include: {
              user: true,
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
      });
      return orders.map((order) => {
        const cartSubtotal = order.cart.cartItems.reduce((acc, cartItem) => {
          return acc + cartItem.quantity * cartItem.product.price;
        }, 0);

        const orderSubtotal = cartSubtotal + (order.deliveryOption?.price ?? 0);

        return {
          ...order,
          cart: {
            ...order.cart,
            subtotal: cartSubtotal,
          },
          subtotal: orderSubtotal,
        };
      }) as OrderItem[];
    } catch (error: any) {
      throw new Error(
        `Erreur lors de la récupération des commandes : ${error.message}`
      );
    }
  } else {
    throw new Error(`Utilisateur non autorisé`);
  }
}

export async function getOrderItemId(
  orderItemId: string
): Promise<OrderProps | null> {
  const session = await getServerSession(authOptions);
  if (session && session.user.role === "ADMIN") {
    try {
      const orderItem = await prisma.orderItems.findUnique({
        where: {
          id: orderItemId,
        },
        include: {
          cart: {
            include: {
              user: true,
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
      });

      if (!orderItem) {
        return null;
      }

      const cartSubtotal = orderItem.cart.cartItems.reduce((acc, cartItem) => {
        return acc + cartItem.quantity * cartItem.product.price;
      }, 0);

      const orderSubtotal =
        cartSubtotal + (orderItem.deliveryOption?.price ?? 0);

      return {
        ...orderItem,
        cart: {
          ...orderItem.cart,
          subtotal: cartSubtotal,
        },
        subtotal: orderSubtotal,
      };
    } catch (error: any) {
      throw new Error(
        `Erreur lors de la récupération de l'élément de commande : ${error.message}`
      );
    }
  } else {
    throw new Error(`Utilisateur non autorisé`);
  }
}
