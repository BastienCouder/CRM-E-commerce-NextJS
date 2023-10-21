import { useState, useCallback } from "react";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import Input from "@/components/Input";

interface ShowPasswordProps {
  password: string;
  setPassword: (value: string) => void;
  type: string;
  variant: string;
}
export default function ShowPassword({
  password,
  setPassword,
  type,
  variant,
}: ShowPasswordProps) {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = useCallback(async () => {
    setShowPassword(!showPassword);
  }, [showPassword]);

  return (
    <>
      <div className="w-full flex flex-col space-y-1 relative">
        <Input
          required={true}
          label="Mot de passe"
          type={showPassword ? "text" : "password"}
          name="password"
          id="password"
          onChange={(e) => setPassword(e.target.value)}
          value={password}
        />
        <button
          type="button"
          onClick={togglePasswordVisibility}
          className="absolute top-8 right-0 px-2 outline-none text-xl cursor-pointer"
        >
          {showPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
        </button>
        {type === "password" && variant === "login" ? (
          <span className="text-xs cursor-pointer">Mot de passe oublié ?</span>
        ) : null}
      </div>
    </>
  );
}
