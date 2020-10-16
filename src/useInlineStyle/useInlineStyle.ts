import {
  useReducer,
  useCallback,
  useRef,
  useMemo,
  useEffect,
  RefObject,
} from 'react';

import { Action, StyleState, StylingFn } from '../types';

const initialState: StyleState = {
  hover: false,
  active: false,
  focus: false,
};

function styleReducer(state: StyleState, action: Action): StyleState {
  switch (action.type) {
    case 'hover':
      return { ...state, hover: action.value as boolean };
    case 'focus':
      return { ...state, focus: action.value as boolean };
    case 'active':
      return { ...state, active: action.value as boolean };
    default:
      return state;
  }
}

export default function useInlineStyle<T extends HTMLElement>(
  styleFn: StylingFn,
  props?: Record<string, unknown>
): [ref: RefObject<T>, style: Record<string, unknown>] {
  const ref = useRef<T>(null);
  const [styleState, dispatch] = useReducer(styleReducer, initialState);
  const setStyle = useCallback(
    (type: string, value: unknown) => dispatch({ type, value }),
    [dispatch]
  );

  const style = useMemo(() => styleFn(styleState, props), [
    styleFn,
    styleState,
    props,
  ]);

  useEffect(() => {
    let el: T;
    const pointerOver = () => setStyle('hover', true);
    const pointerOut = () => setStyle('hover', false);
    const focus = () => setStyle('focus', true);
    const blur = () => setStyle('focus', false);
    const pointerDown = () => setStyle('active', true);
    const pointerUp = () => setStyle('active', false);

    if (ref.current) {
      el = ref.current;
      el.addEventListener('pointerover', pointerOver);
      el.addEventListener('pointerout', pointerOut);
      el.addEventListener('focus', focus);
      el.addEventListener('blur', blur);
      el.addEventListener('pointerdown', pointerDown);
      el.addEventListener('pointerup', pointerUp);
    }
    return () => {
      if (el) {
        el.removeEventListener('pointerover', pointerOver);
        el.removeEventListener('pointerout', pointerOut);
        el.removeEventListener('focus', focus);
        el.removeEventListener('blur', blur);
        el.removeEventListener('pointerdown', pointerDown);
        el.removeEventListener('pointerup', pointerUp);
      }
    };
  }, [ref, setStyle]);

  return [ref, style];
}
