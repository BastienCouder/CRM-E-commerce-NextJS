"use client";
import { Dictionary } from "@/app/lang/dictionaries";
import { Input } from "@/components/ui/input";
import { useState, useCallback } from "react";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";

interface ShowPasswordProps {
  password: string;
  setPassword: (value: string) => void;
  dict: Dictionary;
}

export default function ShowPassword({
  password,
  setPassword,
  dict,
}: ShowPasswordProps) {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = useCallback(() => {
    setShowPassword(!showPassword);
  }, [showPassword]);

  return (
    <div className="w-full flex flex-col space-y-1 relative">
      <Input
        autoComplete="off"
        placeholder={dict.form.password}
        required={false}
        type={showPassword ? "text" : "password"}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button
        aria-label={dict.form.show_password}
        type="button"
        onClick={togglePasswordVisibility}
        className="absolute text-zinc-900 top-1.5 right-0 px-2 outline-none text-xl cursor-pointer"
      >
        {showPassword ? (
          <AiFillEyeInvisible color="rgb(var(--foreground))" />
        ) : (
          <AiFillEye color="rgb(var(--foreground))" />
        )}
      </button>
    </div>
  );
}
