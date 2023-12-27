"use client";
import React, { useState, useCallback, useEffect } from "react";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import styles from "@/styles/keyframes.module.css";
import { CartItem, WishlistItem } from "@/lib/DbSchema";
import { toast } from "sonner";

interface AddToWishlistProps {
  productId: string;
  incrementWishlist: (productId: string) => Promise<void>;
  wishlistItems?: WishlistItem[];
  cartItems: CartItem[];
}

export default function AddToWishlist({
  productId,
  wishlistItems,
  cartItems,
  incrementWishlist,
}: AddToWishlistProps) {
  const [like, setLike] = useState(false);

  const toggleLikeVisibility = useCallback(() => {
    setLike(!like);
  }, [like]);

  const handleAddToWishlist = async () => {
    toggleLikeVisibility();
    await incrementWishlist(productId);
  };

  const alreadyInCart = async () => {
    toast.error("Déjà dans le panier");
  };

  const isProductInWishlist = wishlistItems?.find(
    (item: WishlistItem) => item.productId === productId
  );
  const isProductInCart = cartItems?.find(
    (item: CartItem) => item.productId === productId
  );

  useEffect(() => {
    if (isProductInCart) {
      setLike(false);
    }
    if (isProductInWishlist) {
      setLike(true);
    } else {
      setLike(false);
    }
  }, [isProductInWishlist, isProductInCart]);

  return (
    <>
      <div
        className={`w-0 my-4 cursor-pointer`}
        onClick={!isProductInCart ? handleAddToWishlist : alreadyInCart}
      >
        <p>
          {like ? (
            <AiFillHeart
              size={25}
              className={`${like ? `${styles.pulse}` : ""}`}
            />
          ) : (
            <AiOutlineHeart size={25} />
          )}
        </p>
      </div>
    </>
  );
}
