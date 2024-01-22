import { useTheme } from "next-themes";

interface CircleButtonProps {
  color: string;
  themeName: string;
  isSelected: boolean;
}

export default function ColorCircles() {
  const { theme, setTheme } = useTheme();

  const CircleButton = ({
    color,
    themeName,
    isSelected,
  }: CircleButtonProps) => {
    const borderColor =
      color === "white" ? "black" : color === "black" ? "white" : color;

    const button = (
      <button
        onClick={() => setTheme(themeName)}
        style={{
          width: "30px",
          height: "30px",
          borderRadius: "50%",
          backgroundColor: color,
          border: `2px solid ${borderColor}`,
          cursor: "pointer",
          margin: "5px",
          transition: "transform 1s ease",
          transform: isSelected ? "scale(1.1)" : "scale(1)",
        }}
      />
    );

    if (isSelected) {
      return (
        <span className="w-[45px] h-[45px] rounded-full border flex justify-center items-center">
          {button}
        </span>
      );
    }

    return button;
  };

  return (
    <div className="flex justify-center flex-wrap items-center gap-4 my-8">
      <CircleButton
        color="white"
        themeName="light"
        isSelected={theme === "light"}
      />
      <CircleButton
        color="black"
        themeName="dark"
        isSelected={theme === "dark"}
      />
      <CircleButton
        color="#ff6666"
        themeName="red-light"
        isSelected={theme === "red-light"}
      />
      <CircleButton
        color="#990000"
        themeName="red-dark"
        isSelected={theme === "red-dark"}
      />
      <CircleButton
        color="#add8e6"
        themeName="blue-light"
        isSelected={theme === "blue-light"}
      />
      <CircleButton
        color="#00008b"
        themeName="blue-dark"
        isSelected={theme === "blue-dark"}
      />
      <CircleButton
        color="#98fb98"
        themeName="green-light"
        isSelected={theme === "green-light"}
      />
      <CircleButton
        color="#006400"
        themeName="green-dark"
        isSelected={theme === "green-dark"}
      />
      <CircleButton
        color="#ee82ee"
        themeName="violet-light"
        isSelected={theme === "violet-light"}
      />
      <CircleButton
        color="#9400d3"
        themeName="violet-dark"
        isSelected={theme === "violet-dark"}
      />
    </div>
  );
}
