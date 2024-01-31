import { OrderProps } from "@/lib/db/order";
import { prisma } from "@/lib/prisma";
import { CartItem } from "@/schemas/db-schema";

export async function getLatestPurchasedProducts(): Promise<any[] | null> {
  try {
    const orders = await prisma.orderItems.findMany({
      orderBy: {
        createdAt: "desc",
      },
      where: {
        isPaid: true,
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
      },
    });

    const purchasedProducts = orders.flatMap((order: OrderProps) =>
      order.cart.cartItems.map((cartItem: CartItem) => ({
        ...cartItem.product,
        quantityPurchased: cartItem.quantity,
        purchasedAt: order.createdAt,
      }))
    );

    if (!purchasedProducts) {
      return null;
    }

    return purchasedProducts;
  } catch (error: any) {
    throw new Error(
      `Erreur lors de la récupération des derniers produits achetés : ${error.message}`
    );
  }
}
