"use server";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { checkUserRole } from "@/middlewares/Admin";

import { getServerSession } from "next-auth";
import { prisma } from "@/lib/db/prisma";
import { OrderItems } from "@prisma/client";

export type OrderProps = OrderItems & {
  ///
  subtotal: number;
};

export async function getOrders(): Promise<OrderProps[] | null> {
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

      const subtotal = orders.reduce((acc, order) => {
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

// export async function createOrder(): Promise<OrderProps | null> {
//   try {
//     const session = await getServerSession(authOptions);
//     const admin = await checkUserRole();

//     if (!session || !admin) {
//       console.error("Utilisateur non autorisé pour la création de produits.");
//       return null;
//     }

//     const createdProduct = await prisma.product.create({
//       data: {
//         name: "",
//         description: "",
//         imageUrl: "",
//         price: 0,
//       },
//     });

//     return createdProduct;
//   } catch (error) {
//     console.error("Erreur lors de la création du produit :", error);
//     return null;
//   }
// }
