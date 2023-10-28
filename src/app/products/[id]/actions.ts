"use server";
import { prisma } from "@/lib/db/prisma";
import { revalidatePath } from "next/cache";

import { createCart, getCart } from "@/lib/db/cart";
import { createWishlist, getWishlist } from "@/lib/db/wishlist";
import { createLike, deleteLike, getLike } from "@/lib/db/like";

export async function useServerAddToCart(
  productId: string,
  variantId: string | null
) {
  const cart = (await getCart()) ?? (await createCart());
  const articleInCartWithVariant = cart.cartItems.find(
    (item) => item.variantId === variantId && item.productId === productId
  );
  const articleInCart = cart.cartItems.find(
    (item) => item.productId === productId
  );
  const wishlist = (await getWishlist()) ?? (await createWishlist());
  const articleInWishlist = wishlist.wishlistItems.find(
    (item) => item.productId === productId || item.variantId === variantId
  );

  if (articleInCartWithVariant) {
    await prisma.cartItems.update({
      where: {
        id: articleInCartWithVariant.id,
      },
      data: { quantity: { increment: 1 } },
    });
    revalidatePath(`/products/${productId}`);
  } else {
    if (articleInCart) {
      await prisma.cartItems.update({
        where: {
          id: articleInCart.id,
        },
        data: { quantity: { increment: 1 } },
      });
      revalidatePath(`/products/${productId}`);
    } else {
      const cartItemDataVariant = {
        cartId: cart.id,
        productId,
        variantId,
        quantity: 1,
      };
      const cartItemData = {
        cartId: cart.id,
        productId,
        quantity: 1,
      };

      if (variantId) {
        const productVariant = await prisma.productVariant.findUnique({
          where: {
            id: variantId,
          },
        });
        if (productVariant) {
          await prisma.cartItems.create({
            data: cartItemDataVariant,
          });
        }
      } else {
        await prisma.cartItems.create({
          data: cartItemData,
        });
      }

      const likedProductId = variantId || productId;
      const like = await getLike(likedProductId);
      if (like) {
        await deleteLike(like.id);
      }

      if (articleInWishlist) {
        await prisma.wishlistItems.delete({
          where: {
            id: articleInWishlist.id,
          },
        });
      }

      revalidatePath(`/products/${productId}`);
    }
  }
}

export async function useServerAddWishlist(
  productId: string,
  variantId: string | null
) {
  //DB REST
  const cart = (await getCart()) ?? (await createCart());
  const wishlist = (await getWishlist()) ?? (await createWishlist());

  //Find Method
  const articleInCart = cart.cartItems.find(
    (item) => item.variantId === variantId && item.productId === productId
  );
  const articleInWishlist = wishlist.wishlistItems.find(
    (item) => item.productId === productId && item.variantId === variantId
  );

  const likedProductId = variantId || productId;
  const like = await getLike(likedProductId);

  //global Function
  if (articleInCart) {
    return;
  } else {
    if (articleInWishlist) {
      await handleDeleteFromWishlist(articleInWishlist, productId, variantId);
    } else {
      await handleAddToWishlist(wishlist, productId, variantId);
    }
  }

  revalidatePath(`/products/${productId}`);
}

//Delete To WishList
async function handleDeleteFromWishlist(
  articleInWishlist: any,
  productId: string,
  variantId: string | null
) {
  await prisma.wishlistItems.delete({
    where: {
      id: articleInWishlist.id,
    },
  });

  await handleDeleteLike(productId, variantId);
}

//Add To WishList
async function handleAddToWishlist(
  wishlist: any,
  productId: string,
  variantId: string | null
) {
  await prisma.wishlistItems.create({
    data: {
      wishlistId: wishlist.id,
      productId,
      variantId,
    },
  });

  await handleCreateLike(productId, variantId);
}

//Like
async function handleCreateLike(productId: string, variantId: string | null) {
  const likedProductId = variantId || productId;
  const like = await getLike(likedProductId);

  if (!like) {
    await createLike(likedProductId);
  }
}
//Dislike
async function handleDeleteLike(productId: string, variantId: string | null) {
  const likedProductId = variantId || productId;
  const like = await getLike(likedProductId);

  if (like) {
    await deleteLike(like.id);
  }
}

// "use server";
// ///////////////////////////////
// //////////////////////////////
// ////Error variant add cart and wishlist
// import { prisma } from "@/lib/db/prisma";
// import { revalidatePath } from "next/cache";

// import { createCart, getCart } from "@/lib/db/cart";
// import { createWishlist, getWishlist } from "@/lib/db/wishlist";
// import { createLike, deleteLike, getLike } from "@/lib/db/like";

// //Function Add To Cart
// export async function useServerAddToCart(
//   productId: string,
//   variantId: string | null
// ) {
//   //DB REST
//   const cart = (await getCart()) ?? (await createCart());
//   const wishlist = (await getWishlist()) ?? (await createWishlist());

//   //Find Method
//   //Cart
//   const articleInCart = cart.cartItems.find(
//     (item) => item.productId === productId
//   );
//   const articleInCartWithVariant = cart.cartItems.find(
//     (item) => item.productId === productId && item.variantId === variantId
//   );

//   //Wishlist
//   const articleInWishlist = wishlist.wishlistItems.find(
//     (item) => item.productId === productId
//   );
//   const articleInWishlistWithVariant = wishlist.wishlistItems.find(
//     (item) => item.variantId === variantId && item.productId === productId
//   );

//   //Global function
//   if (articleInCartWithVariant) {
//     await incrementCartItemQuantity(articleInCartWithVariant);
//   } else if (articleInCart) {
//     await incrementCartItemQuantity(articleInCart);
//   } else {
//     if (variantId) {
//       const productVariant = await prisma.productVariant.findUnique({
//         where: {
//           id: variantId,
//         },
//       });
//       if (productVariant) {
//         await createCartItem(cart, productId, variantId);
//         if (articleInWishlistWithVariant) {
//           await deleteWishlistItem(articleInWishlistWithVariant);
//         }
//       }
//     } else {
//       await createCartItem(cart, productId, null);
//       if (articleInWishlist) {
//         await deleteWishlistItem(articleInWishlistWithVariant);
//       }
//       await deleteWishlistItem(articleInWishlist);
//     }

//     revalidatePath(`/products/${productId}`);
//   }
// }

// //Update quantity
// async function incrementCartItemQuantity(cartItem: any) {
//   await prisma.cartItems.update({
//     where: {
//       id: cartItem.id,
//     },
//     data: {
//       quantity: { increment: 1 },
//     },
//   });
//   revalidatePath(`/products/${cartItem.productId}`);
//   console.log(cartItem);
// }

// //Add Item To Cart
// async function createCartItem(
//   cart: any,
//   productId: string,
//   variantId: string | null
// ) {
//   const cartItemData = {
//     cartId: cart.id,
//     productId,
//     variantId,
//     quantity: 1,
//   };
//   await prisma.cartItems.create({
//     data: cartItemData,
//   });
// }

// //Delete Item To Wishlist
// async function deleteWishlistItem(wishlistItem: any) {
//   await prisma.wishlistItems.delete({
//     where: {
//       id: wishlistItem.id,
//     },
//   });
// }

// //Function Add To Wishlist
// export async function useServerAddWishlist(
//   productId: string,
//   variantId: string | null
// ) {
//   //DB REST
//   const cart = (await getCart()) ?? (await createCart());
//   const wishlist = (await getWishlist()) ?? (await createWishlist());

//   //Find Method
//   const articleInCart = cart.cartItems.find(
//     (item) => item.variantId === variantId && item.productId === productId
//   );
//   const articleInWishlist = wishlist.wishlistItems.find(
//     (item) => item.productId === productId && item.variantId === variantId
//   );

//   //global Function
//   if (articleInCart) {
//     return;
//   } else {
//     if (articleInWishlist) {
//       await handleDeleteFromWishlist(articleInWishlist, productId, variantId);
//     } else {
//       await handleAddToWishlist(wishlist, productId, variantId);
//     }
//   }

//   revalidatePath(`/products/${productId}`);
// }

// //Delete To WishList
// async function handleDeleteFromWishlist(
//   articleInWishlist: any,
//   productId: string,
//   variantId: string | null
// ) {
//   await prisma.wishlistItems.delete({
//     where: {
//       id: articleInWishlist.id,
//     },
//   });

//   await handleDeleteLike(productId, variantId);
// }

// //Add To WishList
// async function handleAddToWishlist(
//   wishlist: any,
//   productId: string,
//   variantId: string | null
// ) {
//   await prisma.wishlistItems.create({
//     data: {
//       wishlistId: wishlist.id,
//       productId,
//       variantId,
//     },
//   });

//   await handleCreateLike(productId, variantId);
// }

// //Like
// async function handleCreateLike(productId: string, variantId: string | null) {
//   const likedProductId = variantId || productId;
//   const like = await getLike(likedProductId);

//   if (!like) {
//     await createLike(likedProductId);
//   }
// }

// //DisLike
// async function handleDeleteLike(productId: string, variantId: string | null) {
//   const likedProductId = variantId || productId;
//   const like = await getLike(likedProductId);

//   if (like) {
//     await deleteLike(like.id);
//   }
// }
