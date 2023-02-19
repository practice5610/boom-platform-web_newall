/* eslint-disable no-inner-declarations */
import { useEffect, useState } from 'react';

export enum WindowTypes {
  MOBILE = 'MOBILE',
  DESKTOP = 'DESKTOP',
}

/**
 * https://stackoverflow.com/questions/63406435/how-to-detect-window-size-in-next-js-ssr-using-react-hook
 */
export default function useWindowSize() {
  // Initialize state with undefined width/height so server and client renders match
  // Learn more here: https://joshwcomeau.com/react/the-perils-of-rehydration/
  const [windowSize, setWindowSize] = useState<{ width?: number; height?: number }>({
    width: undefined,
    height: undefined,
  });

  useEffect(() => {
    // only execute all the code below in client side
    if (typeof window !== 'undefined') {
      // Handler to call on window resize
      function handleResize() {
        // Set window width/height to state
        setWindowSize({
          width: window.innerWidth,
          height: window.innerHeight,
        });
      }

      // Add event listener
      window.addEventListener('resize', handleResize);

      // Call handler right away so state gets updated with initial window size
      handleResize();

      // Remove event listener on cleanup
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []); // Empty array ensures that effect is only run on mount
  return {
    ...windowSize,
    type:
      windowSize.width && windowSize.height && windowSize.width < windowSize.height
        ? WindowTypes.MOBILE
        : WindowTypes.DESKTOP,
  };
}
