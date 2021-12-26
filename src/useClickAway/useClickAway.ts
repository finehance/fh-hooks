import { useEffect, useState, useRef } from 'react';

interface ClickAwayPayload<T> {
  ref: React.RefObject<T>;
  active: boolean;
  setActive: (v: boolean) => void;
  toggle: () => void;
}

export function useClickAway<T extends HTMLElement>(
  triggerEvent = 'pointerdown'
): ClickAwayPayload<T> {
  const [active, setActive] = useState(false);
  const ref = useRef<T>(null);

  function toggle(flag?: boolean): void {
    if (typeof flag === 'undefined') {
      setActive(!active);
    } else {
      setActive(flag);
    }
  }

  useEffect(() => {
    const handleClickAway = (e) => {
      const el = ref.current;
      if (!el?.contains(e.target)) setActive(false);
    };

    if (active) {
      document.addEventListener(triggerEvent, handleClickAway);
    } else {
      document.removeEventListener(triggerEvent, handleClickAway);
    }
    return () => {
      document.removeEventListener(triggerEvent, handleClickAway);
    };
  }, [active, triggerEvent]);

  return { ref, active, setActive, toggle };
}
