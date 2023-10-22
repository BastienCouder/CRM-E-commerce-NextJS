"use server";

import { createCart, getCart } from "@/lib/db/cart";
import { prisma } from "@/lib/db/prisma";
import { revalidatePath } from "next/cache";

export async function incrementProductQuantity(
  productId: string,
  variantId: string | null
) {
  const cart = (await getCart()) ?? (await createCart());

  const articleInCart = cart.cartItems.find(
    (item) => item.productId === productId && item.variantId === variantId
  );
  if (articleInCart) {
    await prisma.cartItems.update({
      where: {
        id: articleInCart.id,
      },
      data: { quantity: { increment: 1 } },
    });
  } else {
    if (variantId) {
      const product = await prisma.product.findUnique({
        where: {
          id: productId,
        },
        include: {
          variants: {
            where: {
              id: variantId,
            },
          },
        },
      });
      console.log(product);
    }

    await prisma.cartItems.create({
      data: {
        cartId: cart.id,
        productId,
        variantId,
        quantity: 1,
      },
    });
  }

  revalidatePath("/products/[id]");
}
