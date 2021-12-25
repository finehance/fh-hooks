import { useRef, useMemo, useEffect, RefObject, CSSProperties } from 'react';
import { useSmartReducer } from '../useSmartReducer';

export interface StyleState {
  hover: boolean;
  focus: boolean;
  active: boolean;
}

export type StylingFn<P> = (
  state: StyleState,
  props: Partial<P>
) => Record<string, CSSProperties>;

const initialState: StyleState = {
  hover: false,
  active: false,
  focus: false,
};

const subscribeToEvents = (el, setStyle) => {
  if (el) {
    const pointerOver = () => setStyle('hover', true);
    const pointerOut = () => setStyle('hover', false);
    const focus = () => setStyle('focus', true);
    const blur = () => setStyle('focus', false);
    const pointerDown = () => setStyle('active', true);
    const pointerUp = () => setStyle('active', false);

    el.addEventListener('pointerover', pointerOver);
    el.addEventListener('pointerout', pointerOut);
    el.addEventListener('focus', focus);
    el.addEventListener('blur', blur);
    el.addEventListener('pointerdown', pointerDown);
    el.addEventListener('pointerup', pointerUp);

    return () => {
      el.removeEventListener('pointerover', pointerOver);
      el.removeEventListener('pointerout', pointerOut);
      el.removeEventListener('focus', focus);
      el.removeEventListener('blur', blur);
      el.removeEventListener('pointerdown', pointerDown);
      el.removeEventListener('pointerup', pointerUp);
    };
  }
};

export function useInlineStyle<T extends HTMLElement, P>(
  styleFn: StylingFn<P>,
  props?: Partial<P>
): [ref: RefObject<T>, style: Record<string, CSSProperties>] {
  const ref = useRef<T>(null);
  const [styleState, setStyle] = useSmartReducer(initialState);

  const style = useMemo(() => styleFn(styleState, props), [
    styleFn,
    styleState,
    props,
  ]);

  useEffect(() => subscribeToEvents(ref.current, setStyle), []);

  return [ref, style];
}
