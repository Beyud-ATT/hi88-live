import { useEffect, useState } from "react";

export default function useMobileKeyboardOpen() {
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);

  useEffect(() => {
    const initialWindowHeight = window.innerHeight;

    // iOS-specific detection using visual viewport API
    const handleVisualViewportResize = () => {
      if (!window.visualViewport) return;

      const heightDifference =
        initialWindowHeight - window.visualViewport.height;
      const isKeyboard = heightDifference > 150;

      setIsKeyboardOpen(isKeyboard);
    };

    // Standard detection fallback
    const handleWindowResize = () => {
      const heightDifference = initialWindowHeight - window.innerHeight;
      const isKeyboard = heightDifference > 150;

      setIsKeyboardOpen(isKeyboard);
    };

    // Use VisualViewport API when available (works on iOS)
    if (window.visualViewport) {
      window.visualViewport.addEventListener(
        "resize",
        handleVisualViewportResize
      );
    } else {
      window.addEventListener("resize", handleWindowResize);
    }

    // Focus/blur events as additional signals
    const handleFocus = (e) => {
      if (isInputElement(e.target)) {
        setTimeout(() => {
          handleVisualViewportResize();
          handleWindowResize();
        }, 100);
      }
    };

    document.addEventListener("focus", handleFocus, true);

    return () => {
      if (window.visualViewport) {
        window.visualViewport.removeEventListener(
          "resize",
          handleVisualViewportResize
        );
      } else {
        window.removeEventListener("resize", handleWindowResize);
      }
      document.removeEventListener("focus", handleFocus, true);
    };
  }, []);

  return isKeyboardOpen;
}

// Helper function to check if element is input-like
function isInputElement(element) {
  const tagName = element.tagName.toLowerCase();
  return (
    tagName === "input" ||
    tagName === "textarea" ||
    tagName === "select" ||
    element.isContentEditable
  );
}
