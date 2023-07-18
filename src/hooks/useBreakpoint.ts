import { useState, useEffect, useCallback } from "react";

export type useBreakpoint = {
  isScreenLessThan: boolean;
  screenWidth: number;
};

export function useBreakpoint(breakpoint: number): useBreakpoint {
  const [screenSize, setScreenSize] = useState<useBreakpoint>({
    isScreenLessThan: false,
    screenWidth: 0,
  });

  const handleResize = useCallback((): void => {
    const screenWidth = window.innerWidth;
    const isScreenLessThan = screenWidth < breakpoint;
    setScreenSize({ isScreenLessThan, screenWidth });
  }, [breakpoint]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      handleResize();
      window.addEventListener("resize", handleResize);
      return () => {
        window.removeEventListener("resize", handleResize);
      };
    }
  }, [breakpoint, handleResize]);

  return screenSize;
}
