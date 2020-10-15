export interface Action {
  type: string;
  value: any;
}

export interface StyleState {
  hover: boolean;
  focus: boolean;
  active: boolean;
}

export type StylingFn = (
  s: StyleState,
  p: Record<string, unknown>
) => React.CSSProperties;
