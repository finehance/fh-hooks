import { CSSProperties, RefObject } from 'react';

export * from './useClickAway';
export * from './useDimensions';
export * from './useInlineStyle';
export * from './useInterval';
export * from './useResponsiveness';
export * from './useScroll';
export * from './useSmartReducer';
export * from './useObjectArray';
export { default as utils } from './utils';
export interface Action {
  type: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value?: any;
}

export type CustomReducer<S, A> = (prevState: S, action: A) => S | null;

export type Nullable<T> = T | null;

export type StateSetter = (type: string, value?: unknown) => void;

export interface StyleState {
  hover: boolean;
  focus: boolean;
  active: boolean;
}

export type StylingFn<P> = (state: StyleState, props: P) => CSSProperties;

export interface Dimensions {
  width: number;
  height: number;
  margin: {
    left: number;
    right: number;
    top: number;
    bottom: number;
  };
  canvasWidth: number;
  canvasHeight: number;
}

export type DimensionsPayload = [
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  React.RefObject<any>,
  Dimensions,
  (type: string, value?: unknown) => void
];

export interface ScreenProps {
  size: string;
  orientation: string;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  screenIsAtLeast: (breakpointName: string, orientation?: string) => boolean;
  screenIsAtMost: (breakpointName: string, orientation?: string) => boolean;
}

export interface ScrollState {
  view: {
    width: number;
    height: number;
  };
  triggerPixel: number;
  top: number;
  screenCount: number;
  currentScreen: number;
  documentProgress: number;
  screenProgress: number;
  isBottom: boolean;
}

export interface ScrollProps {
  trigger?: number;
}

export type ScrollPayload<T> = [RefObject<T>, ScrollState];

export interface IObjectArray<T extends Record<string, unknown>> {
  values: T[];
  isEmpty: boolean;
  length: number;
  hasObjectWithKeyOfValue: (k: string, v: any) => boolean;
  hasObjectWithKey: (k: string) => boolean;
  filterByValue: (k: string, v: any) => T[];
  findOneByValue: (k: string, v: any) => T;
  add: (item: T) => void;
  append: (items: T[]) => void;
  removeManyByValue: (k: string, v: any) => void;
  removeByIndex: (i: number) => void;
  replaceOne: (key: string, from: any, to: any) => void;
  replaceAll: (key: string, from: any, to: any) => void;
  clear: () => void;
}
