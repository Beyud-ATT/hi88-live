import { useEffect, useState } from "react";

export default function useMobileKeyboardOpen() {
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);

  useEffect(() => {
    let initialWindowHeight = window.innerHeight;

    const handleResize = () => {
      const heightDifference = initialWindowHeight - window.innerHeight;
      setIsKeyboardOpen(heightDifference > 150);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return isKeyboardOpen;
}
