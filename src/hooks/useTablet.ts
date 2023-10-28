import { useEffect, useState } from "react";

function useTablet() {
  const [isTablet, setIsTablet] = useState<boolean>(false);

  useEffect(() => {
    const handleResize: () => void = () => {
      setIsTablet(window.innerWidth <= 1068 && window.innerWidth >= 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return isTablet;
}

export default useTablet;
