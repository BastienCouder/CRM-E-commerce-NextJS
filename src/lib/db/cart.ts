import { cookies } from "next/dist/client/components/headers";
import { prisma } from "./prisma";
import { Cart, CartItems, Prisma } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/[lang]/api/auth/[...nextauth]/route";
import { Session } from "next-auth";

export type CartWithCartItemsProps = Prisma.CartGetPayload<{
  include: {
    cartItems: {
      include: { product: true; variant: true };
    };
  };
}>;

export type CartItemsProps = Prisma.CartItemsGetPayload<{
  include: { product: true; variant: true };
}>;

export type CartProps = CartWithCartItemsProps & {
  size: number;
  subtotal: number;
};

export async function getCart(): Promise<CartProps | null> {
  const session = await getServerSession(authOptions);

  let cart: CartWithCartItemsProps | null = null;

  if (session) {
    cart = await prisma.cart.findFirst({
      where: {
        userId: session.user.id,
        deleteAt: null,
      },
      include: {
        cartItems: {
          where: { deleteAt: null },
          include: { product: true, variant: true },
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
              include: { product: true, variant: true },
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
    size: cart.cartItems.reduce((acc, item) => acc + item.quantity, 0),
    subtotal: cart.cartItems.reduce((acc, item) => {
      const variantPrice: number | null = item.variant
        ? item.variant.price
        : null;
      const productPrice: number | null = item.product
        ? item.product.price
        : null;
      const price: number | null =
        variantPrice !== null
          ? variantPrice
          : productPrice !== null
          ? productPrice
          : 0;
      return acc + item.quantity * price;
    }, 0),
  };
}

export async function createCart(): Promise<CartProps> {
  const session: Session | null = await getServerSession(authOptions);

  let newCart: Cart;
  if (session) {
    newCart = await prisma.cart.create({
      data: { userId: session.user.id, deleteAt: null },
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
            include: { product: true, variant: true },
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
        include: { product: true, variant: true },
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
          variantId: item.variantId,
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
                variantId: item.variantId,
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

function mergeCartItems(...cartItems: CartItems[][]) {
  return cartItems.reduce((acc, items) => {
    items.forEach((item) => {
      const existingItem = acc.find(
        (i) => i.productId === item.productId && i.variantId === item.variantId
      );
      if (existingItem) {
        existingItem.quantity += item.quantity;
      } else {
        acc.push(item);
      }
    });
    return acc;
  }, [] as CartItems[]);
}
