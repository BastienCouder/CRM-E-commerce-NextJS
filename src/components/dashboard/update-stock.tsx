"use client";

import { updateProductStock } from "@/app/dashboard/(management)/action/update-stock";
import { useState } from "react";

interface UpdateStockProps {
  initialStock: number;
  productId: string;
}

export default function UpdateStock({
  initialStock,
  productId,
}: UpdateStockProps) {
  const [quantity, setQuantity] = useState<number>(initialStock);

  const handleIncrement = () => {
    const newQuantity = quantity + 1;
    updateQuantity(newQuantity);
  };

  const handleDecrement = () => {
    const newQuantity = quantity - 1;
    updateQuantity(newQuantity);
  };

  const updateQuantity = (newQuantity: number) => {
    setQuantity(newQuantity);
    updateProductStock(productId, newQuantity);
  };

  return (
    <div className="flex gap-x-2">
      <button
        className="bg-primary text-background rounded-md px-2"
        onClick={handleDecrement}
      >
        -
      </button>

      <span
        className={`max-w-[500px] truncate font-medium ${
          quantity === 0 ? "text-red-500" : ""
        }`}
      >
        {quantity ? quantity : "Rupture de stock"}
      </span>

      <button
        className="bg-primary text-background rounded-md px-2"
        onClick={handleIncrement}
      >
        +
      </button>
    </div>
  );
}
