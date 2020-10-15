export interface Action {
  type: string;
  value: unknown;
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
