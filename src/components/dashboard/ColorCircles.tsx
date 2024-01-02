"use client";

import { useTheme } from "next-themes";

export default function ColorCircles() {
  const { theme, setTheme } = useTheme();
  return (
    <div className="flex justify-center flex-col items-center space-x-4 my-8">
      <button onClick={() => setTheme("light")}>Thème light</button>
      <button onClick={() => setTheme("dark")}>Thème dark</button>
      <button onClick={() => setTheme("red-light")}>Thème red-light</button>
      <button onClick={() => setTheme("red-dark")}>Thème red-dark</button>
      <button onClick={() => setTheme("blue-light")}>Thème blue-light</button>
      <button onClick={() => setTheme("blue-dark")}>Thème blue-dark</button>
      <button onClick={() => setTheme("green-light")}>Thème green-light</button>
      <button onClick={() => setTheme("green-dark")}>Thème red-dark</button>
      <button onClick={() => setTheme("violet-light")}>
        Thème violet-light
      </button>
      <button onClick={() => setTheme("violet-dark")}>Thème violet-dark</button>
    </div>
  );
}
