import React, { useState } from "react";

interface QuantityProps {
  initialQuantity: number;
  onQuantityChange: (newQuantity: number) => void;
}

const QuantitySelector: React.FC<QuantityProps> = ({
  initialQuantity,
  onQuantityChange,
}) => {
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
          onClick={handleDecrement}
          className="bg-primary text-white px-2"
        >
          -
        </button>
        <p>{quantity}</p>
        <button
          onClick={handleIncrement}
          className="bg-primary text-white px-2"
        >
          +
        </button>
      </div>
    </div>
  );
};

export default QuantitySelector;
