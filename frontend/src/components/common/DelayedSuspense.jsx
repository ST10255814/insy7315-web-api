import { Suspense, useState, useEffect } from "react";
import EnhancedBrandedFallback from "./EnhancedBrandedFallback";

/**
 * DelayedSuspense - A wrapper around React Suspense that ensures the fallback
 * is shown for a minimum duration (3 seconds) even if the component loads faster.
 * This provides a consistent loading experience and prevents flash loading states.
 */
export default function DelayedSuspense({ children, minDelay = 3000, fallback = <EnhancedBrandedFallback /> }) {
  const [isMinDelayComplete, setIsMinDelayComplete] = useState(false);
  const [isComponentReady, setIsComponentReady] = useState(false);

  useEffect(() => {
    // Set up minimum delay timer
    const timer = setTimeout(() => {
      setIsMinDelayComplete(true);
    }, minDelay);

    return () => clearTimeout(timer);
  }, [minDelay]);

  // Show content only when both conditions are met:
  // 1. Component is ready (loaded from Suspense)
  // 2. Minimum delay has elapsed
  const shouldShowContent = isMinDelayComplete && isComponentReady;

  return (
    <Suspense
      fallback={fallback}
    >
      <DelayedContent
        onReady={() => setIsComponentReady(true)}
        show={shouldShowContent}
        fallback={fallback}
      >
        {children}
      </DelayedContent>
    </Suspense>
  );
}

/**
 * Wrapper component that notifies parent when content is ready
 * and conditionally renders content or fallback
 */
function DelayedContent({ children, onReady, show, fallback }) {
  useEffect(() => {
    // Notify parent that component is ready
    onReady();
  }, [onReady]);

  return show ? children : fallback;
}