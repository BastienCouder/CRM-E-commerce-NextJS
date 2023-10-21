import { useState, useCallback } from "react";
import PropTypes from "prop-types";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";

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
        <label htmlFor={password}>
          Mot de passe
          <span className="-mt-1 ml-1">*</span>
        </label>
        <input
          type={showPassword ? "text" : "password"}
          name="password"
          id="password"
          onChange={(e) => setPassword(e.target.value)}
          value={password}
          className="p-1.5 outline-none"
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
