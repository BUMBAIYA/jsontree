import { useEffect, useRef, useState } from "react";

export function useDebounceValue<T>(
  value: T,
  wait: number = 600,
  options: { leading: boolean } = { leading: false },
) {
  const [_value, setValue] = useState(value);
  const refMounted = useRef<boolean>(false);
  const refTimeout = useRef<number | undefined>();
  const refCooldown = useRef<boolean>(false);
  const cancel = () => window.clearTimeout(refTimeout.current);

  useEffect(() => {
    if (refMounted.current) {
      if (!refCooldown.current && options.leading) {
        refCooldown.current = true;
        setValue(value);
      } else {
        cancel();
        refTimeout.current = window.setTimeout(() => {
          refCooldown.current = false;
          setValue(value);
        }, wait);
      }
    }
  }, [value, options.leading, wait]);

  useEffect(() => {
    refMounted.current = true;
    return cancel;
  }, []);

  return [_value, cancel];
}
