import {
  useReducer,
  useCallback,
  useRef,
  useMemo,
  useEffect,
  RefObject,
  CSSProperties,
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

export default function useInlineStyle<T extends HTMLElement, P>(
  styleFn: StylingFn<P>,
  props?: P
): [ref: RefObject<T>, style: CSSProperties] {
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

  const subscribeToEvents = useCallback(() => {
    if (ref.current) {
      const pointerOver = () => setStyle('hover', true);
      const pointerOut = () => setStyle('hover', false);
      const focus = () => setStyle('focus', true);
      const blur = () => setStyle('focus', false);
      const pointerDown = () => setStyle('active', true);
      const pointerUp = () => setStyle('active', false);

      ref.current.addEventListener('pointerover', pointerOver);
      ref.current.addEventListener('pointerout', pointerOut);
      ref.current.addEventListener('focus', focus);
      ref.current.addEventListener('blur', blur);
      ref.current.addEventListener('pointerdown', pointerDown);
      ref.current.addEventListener('pointerup', pointerUp);

      return () => {
        ref.current.removeEventListener('pointerover', pointerOver);
        ref.current.removeEventListener('pointerout', pointerOut);
        ref.current.removeEventListener('focus', focus);
        ref.current.removeEventListener('blur', blur);
        ref.current.removeEventListener('pointerdown', pointerDown);
        ref.current.removeEventListener('pointerup', pointerUp);
      };
    }
  }, [ref, setStyle]);

  useEffect(subscribeToEvents, []);

  return [ref, style];
}
