import { useReducer } from 'react';
import { Action } from '../types';

export function updateObject(object: any, key: string, value: any): any {
  if (has(object, key)) {
    return { ...object, [key]: value };
  }
  console.error(
    `updateObject: Unrecognized property name: ${key}. State was not modified.`
  );
  return object;
}
export function isObject(object: any): boolean {
  return typeof object === 'object' && !Array.isArray(object) && !!object;
}

function has(object: any, key: string): boolean {
  return isObject(object) && Object.prototype.hasOwnProperty.call(object, key);
}

export function baseReducer(state: any, action: Action): any {
  return updateObject(state, action.type, action.value);
}

const makeReducer = (customReducer: any = null) => (
  state: any,
  action: Action
): any => {
  if (!customReducer) {
    return baseReducer(state, action);
  }
  const newState = customReducer(state, action);
  if (newState === null) {
    return baseReducer(state, action);
  }
  return newState;
};

/**
 * Returns new state as provided from custom reducer.
 * If customReducer is not provided it will check if action.type matches with name of any property in the initialState.
 * If action.type matches with state property then it will update it with given action.value.
 * If action.value is not provided and customReducer is not given it will not change state.
 * If customReducer is provided and it returns null as default case, then the baseReducer will be used as default.
 * If customReducer is provided and it returns unchanged state as default case then baseReducer will not be used and state will be handled
 * exactly as per provided reducer.
 * @param initialState initial state of the reducer.
 * @param customReducer custom reducer functiom
 *
 * @return [ state, setState ], where state is updated state and setState is function that accepts (type: string, value?: any = null);
 */

// TODO make it generic type for state T instead of any
export default function useSmartReducer(
  initialState: any,
  customReducer: any = null
) {
  const keys = Object.keys(initialState);

  const [state, dispatch] = useReducer(
    makeReducer(customReducer),
    initialState
  );

  function setState(type: string, value = null): void {
    if (customReducer) {
      dispatch({ type, value });
    } else if (keys.includes(type)) {
      if (value !== null) {
        dispatch({ type, value });
      } else {
        console.error(
          `SmartReducer: Missing action.value for '${type}'. Provide the value or pass a custom reducer.`
        );
      }
    } else {
      console.error(
        `SmartReducer: Unrecognized action.type: ${type}. Make sure '${type}' is defined in the initial state.`
      );
    }
  }

  return [state, setState];
}
