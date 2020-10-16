import { useEffect, useState, useCallback, useRef } from 'react';

interface ClickAwayPayload {
  ref: React.RefObject<unknown>;
  active: boolean;
  setActive: (v: boolean) => void;
  toggle: () => void;
}

export default function useClickAway<
  T extends HTMLElement
>(): ClickAwayPayload {
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
      document.addEventListener('mousedown', handleClickAway);
    } else {
      document.removeEventListener('mousedown', handleClickAway);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickAway);
    };
  }, [active]);

  return { ref, active, setActive, toggle };
}
