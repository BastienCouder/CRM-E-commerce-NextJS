"use client";
import { ComponentProps } from "react";
import { experimental_useFormStatus as useFormStatus } from "react-dom";
import buttonStyles from "@/styles/Button.module.css";

type FormSubmitButtonProps = {
  children: React.ReactNode;
  className?: string;
} & ComponentProps<"button">;

export default function FormSubmitButton({
  children,
  className,
  ...props
}: FormSubmitButtonProps) {
  const { pending } = useFormStatus();
  return (
    <button
      {...props}
      className={`btn bg-inherit hover:bg-inherit outline-none py-3 px-5 justify-center relative border-none uppercase tracking-[4px] flex items-center ${className} ${buttonStyles.button}`}
      type="submit"
      disabled={pending}
    >
      {pending && <span className="loading loading-spinner" />}
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
