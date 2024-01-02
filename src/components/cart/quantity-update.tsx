"use client";
import { Dictionary } from "@/app/lang/dictionaries";
import React, { useState } from "react";

interface QuantityProps {
  initialQuantity: number;
  onQuantityChange: (newQuantity: number) => void;
  dict: Dictionary;
}

export default function QuantitySelector({
  initialQuantity,
  onQuantityChange,
  dict,
}: QuantityProps) {
  const [quantity, setQuantity] = useState<number>(initialQuantity);

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
    onQuantityChange(newQuantity);
  };

  return (
    <div className="lg:h-[55px] justify-start">
      <div className="flex mt-[1.2rem] space-x-2">
        <button
          aria-label={dict.actions.increment}
          onClick={handleDecrement}
          className="bg-primary text-white px-2"
        >
          -
        </button>
        <p>{quantity}</p>
        <button
          aria-label={dict.actions.decrement}
          onClick={handleIncrement}
          className="bg-primary text-white px-2"
        >
          +
        </button>
      </div>
    </div>
  );
}
