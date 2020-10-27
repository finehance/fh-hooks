import { useEffect, useState, useCallback, useRef } from 'react';

interface ClickAwayPayload<T> {
  ref: React.RefObject<T>;
  active: boolean;
  setActive: (v: boolean) => void;
  toggle: () => void;
}

export default function useClickAway<T extends HTMLElement>(): ClickAwayPayload<
  T
> {
  const [active, setActive] = useState(false);
  const ref = useRef<T>(null);

  const handleClickAway = useCallback((e) => {
    const el = ref.current;
    if (!el?.contains(e.target)) setActive(false);
  }, []);

  function toggle() {
    setActive(!active);
  }

  useEffect(() => {
    if (active) {
      document.addEventListener('pointerdown', handleClickAway);
    } else {
      document.removeEventListener('pointerdown', handleClickAway);
    }
    return () => {
      document.removeEventListener('pointerdown', handleClickAway);
    };
  }, [active]);

  return { ref, active, setActive, toggle };
}
