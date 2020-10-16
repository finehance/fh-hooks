export interface Action {
  type: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value?: any;
}

export interface StyleState {
  hover: boolean;
  focus: boolean;
  active: boolean;
}

export type StylingFn = (
  state: StyleState,
  props: Record<string, unknown>
) => Record<string, unknown>;
