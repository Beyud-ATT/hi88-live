import { useState, useEffect } from "react";

/**
 * A custom hook that detects the direction of scrolling
 *
 * @param {Object} options - Configuration options for the hook
 * @param {number} options.thresholdPixels - Minimum scroll distance to trigger direction change
 * @param {number} options.throttleTime - Throttle time in milliseconds
 * @returns {Object} An object containing the current scroll direction and position
 */
const useScrollDirection = ({
  element = window,
  thresholdPixels = 10,
  throttleTime = 100,
} = {}) => {
  const [isSrcollUp, setIsSrcollUp] = useState(false);
  const [isSrcollDown, setIsSrcollDown] = useState(false);

  useEffect(() => {
    if (!element) return;

    let lastScrollY = element.scrollTop;
    let ticking = false;

    const updateScrollDirection = () => {
      const currentScrollY = element.scrollTop;

      // Update Y direction if we've scrolled past the threshold
      if (Math.abs(currentScrollY - lastScrollY) > thresholdPixels) {
        if (currentScrollY > lastScrollY) {
          setIsSrcollDown(true);
          setIsSrcollUp(false);
        } else {
          setIsSrcollUp(true);
          setIsSrcollDown(false);
        }

        lastScrollY = currentScrollY;
      }

      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        // Use requestAnimationFrame for performance
        window.requestAnimationFrame(updateScrollDirection);
        ticking = true;
      }
    };

    // Throttle the scroll event
    const throttledScrollHandler = () => {
      let scrollTimeout;

      return () => {
        if (scrollTimeout) return;

        scrollTimeout = setTimeout(() => {
          scrollTimeout = null;
          onScroll();
        }, throttleTime);
      };
    };

    element.addEventListener("scroll", throttledScrollHandler());

    return () =>
      element.removeEventListener("scroll", throttledScrollHandler());
  }, [thresholdPixels, throttleTime, element]);

  return { isSrcollUp, isSrcollDown };
};

export default useScrollDirection;
