import { useEffect, useRef } from 'react';

type AnyFunction = (props?: any) => any;

export default function useInterval(
  callback: AnyFunction,
  delay: number | undefined
) {
  const savedCallback = useRef<AnyFunction>(callback);

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
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
