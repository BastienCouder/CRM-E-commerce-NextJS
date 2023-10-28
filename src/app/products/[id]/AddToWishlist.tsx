import React, { useState, useCallback, useTransition } from "react";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import { ShoppingLike } from "@/lib/db/like";

interface AddToWishlistProps {
  productId: string;
  variantId?: string | null;
  like: ShoppingLike | null;
  incrementWishlist: (
    productId: string,
    variantId: string | null
  ) => Promise<void>;
}

export default function AddToWishlist({
  productId,
  variantId = null,
  like,
  incrementWishlist,
}: AddToWishlistProps) {
  const [isPending, startTransition] = useTransition();
  const [checkLike, setCheckLike] = useState(false);

  const toggleLikeVisibility = useCallback(() => {
    setCheckLike(!like);
  }, [like]);

  const handleAddToWishlist = async () => {
    toggleLikeVisibility();
    await incrementWishlist(productId, variantId);
  };

  return (
    <>
      <div className="w-0 my-4 cursor-pointer" onClick={handleAddToWishlist}>
        <p>{like ? <AiFillHeart size={25} /> : <AiOutlineHeart size={25} />}</p>
      </div>
    </>
  );
}
