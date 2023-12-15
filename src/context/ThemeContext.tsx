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
        "forest",
        "violet",
        "boisée",
        "fée",
        "earth",
        "light",
        "dark",
      ]}
      defaultTheme="dark"
    >
      {children}
    </ThemeProvider>
  );
}
