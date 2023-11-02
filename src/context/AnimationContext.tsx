"use client";
import {
  createContext,
  useContext,
  useState,
  ReactNode,
  Dispatch,
  SetStateAction,
} from "react";

interface AnimationContextType {
  disableAnimation: boolean;
  setDisableAnimation: Dispatch<SetStateAction<boolean>>;
}

const AnimationContext = createContext<AnimationContextType | undefined>(
  undefined
);

export function useAnimationContext(): AnimationContextType {
  const context = useContext(AnimationContext);
  if (!context) {
    throw new Error(
      "useAnimationContext must be used within an AnimationProvider"
    );
  }
  return context;
}

interface AnimationProviderProps {
  children: ReactNode;
}

export function AnimationProvider({ children }: AnimationProviderProps) {
  const [disableAnimation, setDisableAnimation] = useState(false);

  return (
    <AnimationContext.Provider
      value={{ disableAnimation, setDisableAnimation }}
    >
      {children}
    </AnimationContext.Provider>
  );
}
