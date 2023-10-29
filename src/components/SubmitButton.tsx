"use client";
import React from "react";
import { HTMLProps } from "react";
import buttonStyles from "@/styles/Button.module.css";

type SubmitButtonProps = {
  children: React.ReactNode;
  className?: string;
  type?: "button" | "submit" | "reset";
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
} & HTMLProps<HTMLButtonElement>;
export default function SubmitButton({
  children,
  className,
  type,
  onClick,
  ...props
}: SubmitButtonProps) {
  return (
    <button
      {...props}
      className={`border-none outline-none py-3 px-5 text-white justify-center relative uppercase tracking-[4px] flex justify-center items-center ${className} ${buttonStyles.button}`}
      type={type}
      onClick={onClick}
    >
      <div className={buttonStyles.buttonLeft}></div>
      <div className={buttonStyles.buttonTopLeft}></div>
      <div className={buttonStyles.buttonBottomLeft}></div>
      <div className={buttonStyles.buttonTop}></div>
      <div className={buttonStyles.buttonBottom}></div>
      <div className={buttonStyles.buttonRight}></div>
      <div className={buttonStyles.buttonTopRight}></div>
      <div className={buttonStyles.buttonBottomRight}></div>
      {children}
    </button>
  );
}
