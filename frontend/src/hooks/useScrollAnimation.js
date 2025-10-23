import { useState, useEffect } from "react";

/**
 * Custom hook for scroll-based animations
 * @returns {Object} Scroll animation utilities
 */
export function useScrollAnimation() {
  const [offsetY, setOffsetY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setOffsetY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Helper function to create transform styles for parallax effects
  const getParallaxStyle = (multiplier = 0.3) => ({
    transform: `translateY(${offsetY * multiplier}px)`,
  });

  const getReverseParallaxStyle = (multiplier = 0.2) => ({
    transform: `translateY(-${offsetY * multiplier}px)`,
  });

  return {
    offsetY,
    getParallaxStyle,
    getReverseParallaxStyle,
  };
}