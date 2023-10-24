import React, { useState, useCallback, useTransition } from "react";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import { Toaster, toast } from "sonner";
import { Like } from "@prisma/client";

interface AddToWishlistProps {
  productId: string;
  userId: string;
  variantId?: string | null;
  like: Like | null;
  incrementWishlist: (
    productId: string,
    variantId: string | null,
    userId: string
  ) => Promise<void>;
}

export default function AddToWishlist({
  productId,
  variantId = null,
  like,
  userId,
  incrementWishlist,
}: AddToWishlistProps) {
  const [isPending, startTransition] = useTransition();
  const [checkLike, setCheckLike] = useState(false);

  const toggleLikeVisibility = useCallback(() => {
    setCheckLike(!like);
  }, [like]);
  console.log(like);

  const handleAddToWishlist = async () => {
    toggleLikeVisibility();
    await incrementWishlist(productId, variantId, userId);
  };

  return (
    <>
      <div className="w-0 my-4 cursor-pointer" onClick={handleAddToWishlist}>
        <p>{like ? <AiFillHeart size={25} /> : <AiOutlineHeart size={25} />}</p>
      </div>

      <Toaster expand={false} position="bottom-left" />
    </>
  );
}
