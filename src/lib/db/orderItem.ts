"use server";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { checkUserRole } from "@/middlewares/Admin";

import { getServerSession } from "next-auth";
import { prisma } from "@/lib/db/prisma";
import { OrderItems } from "@prisma/client";

export type OrderProps = OrderItems & {
  ///
  subtotal?: number;
};

export async function getOrderItems(): Promise<OrderProps[] | null> {
  const session = await getServerSession(authOptions);
  const admin = await checkUserRole();

  if (!admin) {
    try {
      const orders = await prisma.orderItems.findMany({
        include: {
          cart: {
            include: {
              user: true,
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
      });

      const subtotal: number = orders.reduce((acc, order) => {
        const cart = order.cart;
        if (cart) {
          const cartItems = cart.cartItems;
          if (cartItems) {
            acc += cartItems.reduce((itemAcc, item) => {
              const variantPrice = item.variant ? item.variant.price : null;
              const productPrice = item.product ? item.product.price : null;
              const price =
                variantPrice !== null
                  ? variantPrice
                  : productPrice !== null
                  ? productPrice
                  : 0;
              return itemAcc + item.quantity * price;
            }, 0);
          }
        }
        return acc;
      }, 0);

      return orders.map((order) => ({
        ...order,
        subtotal,
      })) as OrderProps[];
    } catch (error) {
      console.error("Erreur lors de la récupération des commandes :", error);
      return null;
    }
  } else {
    console.error(
      "Erreur lors de la récupération des produits : Utilisateur non autorisé"
    );
    return null;
  }
}
