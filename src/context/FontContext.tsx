"use client";
import { createContext, useContext, ReactNode, useState } from "react";

interface FontContextProps {
  selectedFont: string;
  setFont: (font: string) => void;
}

const FontContext = createContext<FontContextProps | undefined>(undefined);

export const FontProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [selectedFont, setSelectedFont] = useState<string>("inter");

  const setFont = (font: string) => {
    setSelectedFont(font);
  };

  return (
    <FontContext.Provider value={{ selectedFont, setFont }}>
      {children}
    </FontContext.Provider>
  );
};

export const useFont = () => {
  const context = useContext(FontContext);
  if (!context) {
    throw new Error("useFont must be used within a FontProvider");
  }
  return context;
};
