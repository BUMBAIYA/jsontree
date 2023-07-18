import { RefObject, useEffect, useRef, useState } from "react";

export type Size = {
  width: number;
  height: number;
};

export function useElementSize<T extends HTMLElement = HTMLDivElement>(): [
  RefObject<T>,
  Size,
] {
  const [size, setSize] = useState<Size>({ width: 0, height: 0 });
  const targetRef = useRef<T>(null);

  useEffect(() => {
    const target = targetRef.current;

    if (!target) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        setSize({ width: Math.round(width), height: Math.round(height) });
      }
    });

    resizeObserver.observe(target);

    return () => {
      resizeObserver.unobserve(target);
    };
  }, []);

  return [targetRef, size];
}
