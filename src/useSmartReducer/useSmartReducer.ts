import * as React from 'react';
import { Action } from '../types';

function updateObject(object: any, key: string, value: any): any {
  if (has(object, key)) {
    return { ...object, [key]: value };
  }
  console.error(
    `updateObject: Unrecognized property name: '${key}'. State was not modified.`
  );
  return object;
}
function isObject(object: any): boolean {
  return typeof object === 'object' && !Array.isArray(object) && !!object;
}

function has(object: any, key: string): boolean {
  return isObject(object) && Object.prototype.hasOwnProperty.call(object, key);
}

function baseReducer(state: any, action: Action): any {
  return updateObject(state, action.type, action.value);
}

function makeReducer(customReducer?: any) {
  return function reducerFn(state: any, action: Action): any {
    if (typeof customReducer === 'undefined') {
      return baseReducer(state, action);
    }
    const newState = customReducer(state, action);
    if (newState === null) {
      return baseReducer(state, action);
    }
    return newState;
  };
}

/**
 * Hook works object '{}' state only.
 * Similarly to React useState and useReducer retaining all advantages of both and less verbosity than useReducer.
 *
 * How it works:
 * the hook returns [state, setState].
 * setState accepts two arguments (type, value), where:
 * - type is the key of the state or reducer's action name,
 * - value is the new value of the portion of the state defined by type.
 * setState returns new state as provided by custom reducer.
 *
 * If customReducer is not provided it will check if first argument of setState (action.type) matches with any key in the initialState.
 * If action.type matches with any state key then the hook will update the state with given second argument of setState (action.value).
 * If action.value is not provided and customReducer is not given it will not change state.
 * If customReducer is provided and it returns null as default case, then the baseReducer will be used as default.
 * If customReducer is provided and it returns unchanged state as default case then baseReducer will not be used and state will be handled
 * exactly as per provided reducer.
 * @param initialState initial state of the reducer.
 * @param customReducer custom reducer functiom
 *
 * @return [ state, setState ], where state is current state and setState is function that accepts (type: string, value?: any = null);
 */

// TODO make it generic type for state T instead of any
function useSmartReducer(
  initialState: Record<string, unknown>,
  customReducer?: any
): any {
  if (!isObject(initialState)) {
    console.error(`SmartReducer: initialState should be an Object.`);
    return [
      initialState,
      (v?: unknown) => {
        return;
      },
    ];
  }
  const reducer = makeReducer(customReducer);
  const [state, dispatch] = React.useReducer(reducer, initialState);

  function setState(type: string, value?: any): void {
    if (customReducer || typeof value !== 'undefined') {
      dispatch({ type, value });
      return;
    }

    console.error(
      `SmartReducer: Missing action.value for '${type}'. Provide the value or pass a custom reducer.`
    );

    return;
  }

  return [state, setState];
}

export default useSmartReducer;
