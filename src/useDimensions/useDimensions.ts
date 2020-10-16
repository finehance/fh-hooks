import { useRef, useEffect } from 'react';
import { Action } from '../types';
import { useSmartReducer } from '../useSmartReducer';
interface Dimensions {
  width: number;
  height: number;
  margin: {
    left: number;
    right: number;
    top: number;
    bottom: number;
  };
  canvasWidth?: number;
  canvasHeight?: number;
}

type DimensionsPayload<T> = [
  React.RefObject<T>,
  Dimensions,
  (type: string, value?: unknown) => void
];

const DEFAULT_DIMENSIONS: Dimensions = {
  width: globalThis.innerWidth,
  height: globalThis.innerHeight,
  canvasWidth: globalThis.innerWidth,
  canvasHeight: globalThis.innerHeight,
  margin: {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  },
};

export default function useDimensions<T>(
  passedSettings: Partial<Dimensions> = null
): DimensionsPayload<T> {
  const ref = useRef<T>(null);

  const combined = {
    width: passedSettings?.width || DEFAULT_DIMENSIONS.width,
    height: passedSettings?.height || DEFAULT_DIMENSIONS.height,
    margin: {
      left: passedSettings?.margin?.left || DEFAULT_DIMENSIONS.margin.left,
      right: passedSettings?.margin?.right || DEFAULT_DIMENSIONS.margin.right,
      top: passedSettings?.margin?.top || DEFAULT_DIMENSIONS.margin.top,
      bottom:
        passedSettings?.margin?.bottom || DEFAULT_DIMENSIONS.margin.bottom,
    },
  };

  const [dim, setDimensions] = useSmartReducer<Dimensions>(
    combined,
    dimensionsReducer
  );

  useEffect(() => subscribeToResize(ref.current, setDimensions), []);

  const canvasHeight = Math.max(
    dim.height - dim.margin.top - dim.margin.bottom,
    0
  );
  const canvasWidth = Math.max(
    dim.width - dim.margin.left - dim.margin.right,
    0
  );

  const enhanced: Dimensions = {
    ...dim,
    canvasHeight,
    canvasWidth,
  };

  return [ref, enhanced, setDimensions];
}

function dimensionsReducer(state: Dimensions, action: Action) {
  if (action.type === 'resize')
    return { ...state, width: action.value.width, height: action.value.height };
  if (action.type === 'margin')
    return { ...state, margin: { ...state.margin, ...action.value } };
  if (action.type === 'marginLeft')
    return { ...state, margin: { ...state.margin, left: action.value } };
  if (action.type === 'marginRight')
    return { ...state, margin: { ...state.margin, right: action.value } };
  if (action.type === 'marginTop')
    return { ...state, margin: { ...state.margin, top: action.value } };
  if (action.type === 'marginBottom')
    return { ...state, margin: { ...state.margin, bottom: action.value } };
  return null;
}

function subscribeToResize(refEl, dispatchFn) {
  let resizeTimer;
  const handleResize = () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      dispatchFn('resize', {
        width: refEl.clientWidth,
        height: refEl.clientHeight,
      });
    }, 200);
  };
  window.addEventListener('resize', handleResize);
  dispatchFn('resize', {
    width: refEl.clientWidth,
    height: refEl.clientHeight,
  });

  return () => {
    clearTimeout(resizeTimer);
    resizeTimer = null;
    window.removeEventListener('resize', handleResize);
  };
}
