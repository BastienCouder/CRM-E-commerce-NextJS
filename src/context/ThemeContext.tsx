"use client";

import { ReactNode } from "react";
import { ThemeProvider } from "next-themes";

interface ThemeProvidersProps {
  children: ReactNode;
}

export function ThemeProviders({ children }: ThemeProvidersProps) {
  return (
    <ThemeProvider
      attribute="class"
      themes={[
        "ice",
        "red-light",
        "red-dark",
        "green-light",
        "green-dark",
        "blue-light",
        "blue-dark",
        "violet-light",
        "violet-dark",
        "light",
        "dark",
      ]}
      defaultTheme="dark"
    >
      {children}
    </ThemeProvider>
  );
}
