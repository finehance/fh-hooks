import { useEffect, useCallback, useRef, RefObject, useReducer } from 'react';
import { ScrollPayload, ScrollState, Action, Nullable } from '..';

export const defaultScroll: ScrollState = {
  view: {
    width: globalThis.innerWidth,
    height: globalThis.innerHeight,
  },
  top: 0,
  triggerPixel: 0,
  screenCount: 0,
  currentScreen: 0,
  documentProgress: 0,
  screenProgress: 0,
  isBottom: false,
};

const SET_SCROLL = 'SET_SCROLL';

function reducer(state: ScrollState, action: Action): Nullable<ScrollState> {
  switch (action.type) {
    case SET_SCROLL: {
      return {
        ...state,
        ...action.value,
      };
    }
    default:
      return null;
  }
}

/**
 * Subscribes to window scroll event and provides:
 *
 * 1) information about scroll progress relative to whole document
 *
 * 2) information about scroll progress relative to currently viewied 'screen'
 *
 * 3) manual way of setting the scroll position
 *
 * 4) enables subscribing to ScrollState changes
 *
 * @param trigger shift of the screen change trigger
 */

const defaultProps = { trigger: 0.0 };
export default function useScroll<T extends HTMLElement>({
  trigger,
} = defaultProps): ScrollPayload {
  const refElement: RefObject<T> = useRef(null);
  const [scrollState, dispatch] = useReducer(reducer, defaultScroll);

  useEffect(() => {
    const handler = function () {
      window.scrollTo(0, 0);
    };
    window.addEventListener('onbeforeunload', handler);

    return () => {
      window.removeEventListener('onbeforeunload', handler);
    };
  }, []);

  const onScroll = useCallback(() => {
    const docHeight = refElement.current?.clientHeight;
    const bbox = refElement.current?.getBoundingClientRect();
    dispatch({
      type: SET_SCROLL,
      value: calculateScrollState(bbox, docHeight, trigger),
    });
  }, [dispatch, trigger]);

  useEffect(() => {
    window.addEventListener('resize', onScroll);
    window.addEventListener('scroll', onScroll);
    return () => {
      window.removeEventListener('resize', onScroll);
      window.removeEventListener('scroll', onScroll);
    };
  }, [onScroll]);

  return [refElement, scrollState];
}

function calculateScrollState(
  bbox: DOMRect,
  docHeight: number,
  triggerPercent: number
): ScrollState {
  const view = {
    height: window.innerHeight,
    width: window.innerWidth,
  };
  const screenCount = Math.floor(docHeight / view.height);
  const triggerPixel = triggerPercent * view.height;
  const viewScrollPosition = (window.scrollY + triggerPixel) / view.height;
  const currentScreen = Math.floor(viewScrollPosition);
  const screenProgress = viewScrollPosition - currentScreen;
  const documentProgress = window.scrollY / docHeight;
  const isBottom = view.height - docHeight === bbox.y;

  return {
    view,
    top: window.scrollY,
    isBottom,
    screenCount,
    currentScreen,
    screenProgress,
    documentProgress,
    triggerPixel,
  };
}
