import React, { useState, useCallback, useEffect } from "react";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";

interface AddToWishlistProps {
  handleColorChange: (color: string) => void;
  productId: string;
  variantId?: string | null;
  incrementWishlist: (
    productId: string,
    variantId: string | null
  ) => Promise<void>;
  wishlistItems: any;
}

export default function AddToWishlist({
  productId,
  variantId = null,
  handleColorChange,
  wishlistItems,
  incrementWishlist,
}: AddToWishlistProps) {
  const [like, setLike] = useState(false);

  const toggleLikeVisibility = useCallback(() => {
    setLike(!like);
  }, [like]);

  const handleAddToWishlist = async () => {
    toggleLikeVisibility();
    await incrementWishlist(productId, variantId);
  };

  const isProductInWishlist = wishlistItems.find(
    (item: any) => item.productId === productId && item.variantId === variantId
  );
  if (
    isProductInWishlist &&
    isProductInWishlist.productId === productId &&
    isProductInWishlist.variantId === variantId
  ) {
  }
  useEffect(() => {
    if (isProductInWishlist) {
      setLike(true);
    } else {
      setLike(false);
    }
  }, [isProductInWishlist, handleColorChange]);

  return (
    <>
      <div className="w-0 my-4 cursor-pointer" onClick={handleAddToWishlist}>
        <p>{like ? <AiFillHeart size={25} /> : <AiOutlineHeart size={25} />}</p>
      </div>
    </>
  );
}
