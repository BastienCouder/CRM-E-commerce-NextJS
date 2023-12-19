"use client";

import { useTheme } from "next-themes";

export default function ColorCircles() {
  const { theme, setTheme } = useTheme();
  return (
    <div className="flex justify-center items-center space-x-4 my-8">
      <button onClick={() => setTheme("ice")}>Thème Ice</button>
      <button onClick={() => setTheme("forest")}>Thème Forest</button>
    </div>
  );
}
