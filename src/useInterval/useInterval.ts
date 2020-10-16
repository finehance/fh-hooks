import { useEffect, useRef } from 'react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyFunction = (props?: any) => any;

export default function useInterval(
  callback: AnyFunction,
  delay: number | undefined
): void {
  const savedCallback = useRef<AnyFunction>(callback);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay) {
      const id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}
