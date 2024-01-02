import { cookies } from "next/dist/client/components/headers";
import { prisma } from "@/lib/prisma";
import { Cart, CartItem } from "@/schemas/DbSchema";
import { auth } from "@/auth";
import { currentUser } from "@/lib/auth";

export type CartProps = Cart & {
  size: number;
  subtotal: number;
};

export async function getCart(): Promise<CartProps | null> {
  const session = await currentUser();

  let cart: CartProps | null = null;
  if (session) {
    cart = await prisma.cart.findFirst({
      where: {
        userId: session.id,
        deleteAt: null,
      },
      include: {
        cartItems: {
          where: { deleteAt: null },
          include: { product: true },
        },
      },
    });
  } else {
    const localCartId: string | undefined = cookies().get("localCartId")?.value;
    cart = localCartId
      ? await prisma.cart.findUnique({
          where: { id: localCartId },
          include: {
            cartItems: {
              where: { deleteAt: null },
              include: { product: true },
            },
          },
        })
      : null;
  }

  if (!cart) {
    return null;
  }

  return {
    ...cart,
    size: cart.cartItems.reduce(
      (acc: number, item: CartItem) => acc + item.quantity,
      0
    ),
    subtotal: cart.cartItems.reduce((acc: number, item: CartItem) => {
      const productPrice: number | null = item.product
        ? item.product.price
        : null;
      const price: number | null = productPrice !== null ? productPrice : 0;
      return acc + item.quantity * price;
    }, 0),
  };
}

export async function createCart(): Promise<CartProps> {
  const session = await currentUser();

  let newCart: Cart;
  if (session) {
    newCart = await prisma.cart.create({
      data: { userId: session.id, deleteAt: null },
    });
  } else {
    newCart = await prisma.cart.create({
      data: { deleteAt: null },
    });
  }

  cookies().set("localCartId", newCart.id);

  return {
    ...newCart,
    cartItems: [],
    size: 0,
    subtotal: 0,
  };
}

export async function mergeAnonymousCartIntoUserCart(userId: string) {
  const localCartId: string | undefined = cookies().get("localCartId")?.value;

  const localCart = localCartId
    ? await prisma.cart.findUnique({
        where: { id: localCartId },
        include: {
          cartItems: {
            include: { product: true },
          },
        },
      })
    : null;

  if (!localCart) {
    return;
  }

  const userCart = await prisma.cart.findFirst({
    where: { userId },
    include: {
      cartItems: {
        include: { product: true },
      },
    },
  });

  await prisma.$transaction(async (tx) => {
    if (userCart) {
      const mergedCartItems = mergeCartItems(
        localCart.cartItems,
        userCart.cartItems
      );

      await tx.cartItems.deleteMany({
        where: { cartId: userCart.id },
      });

      await tx.cartItems.createMany({
        data: mergedCartItems.map((item) => ({
          cartId: userCart.id,
          productId: item.productId,
          quantity: item.quantity,
          deleteAt: null,
        })),
      });
    } else {
      await tx.cart.create({
        data: {
          userId,
          cartItems: {
            createMany: {
              data: localCart.cartItems.map((item) => ({
                productId: item.productId,
                quantity: item.quantity,
                deleteAt: null,
              })),
            },
          },
        },
      });
    }

    await tx.cart.delete({
      where: { id: localCart.id },
    });

    cookies().set("localCartId", "");
  });
}

function mergeCartItems(...cartItems: CartItem[][]) {
  return cartItems.reduce((acc, items) => {
    items.forEach((item) => {
      const existingItem = acc.find((i) => i.productId === item.productId);
      if (existingItem) {
        existingItem.quantity += item.quantity;
      } else {
        acc.push(item);
      }
    });
    return acc;
  }, [] as CartItem[]);
}
