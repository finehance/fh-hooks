import { Reducer, useMemo, useReducer } from 'react';
import { Action } from '../types';

function updateObject<T>(object: T, key: string, value: unknown): T {
  if (has(object, key)) {
    return { ...object, [key]: value };
  }
  console.error(
    `updateObject: Unrecognized property name: '${key}'. State was not modified.`
  );
  return object;
}

function has<T>(object: T, key: string): boolean {
  return isObject(object) && Object.prototype.hasOwnProperty.call(object, key);
}

function isObject<T>(object: T): boolean {
  return typeof object === 'object' && !Array.isArray(object) && !!object;
}

function baseReducer<T>(state: T, action: Action): T {
  return updateObject(state, action.type, action.value);
}

function makeReducer<T>(customReducer?: Reducer<T, Action>) {
  return function reducerFn(state: T, action: Action): T {
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
 * Hook works with object '{}' state only.
 * Similarly to React useState and useReducer retaining all advantages of both and less verbosity than useReducer.
 *
 * How it works:
 * the hook returns [state, setState].
 * setState accepts two arguments (type, value), where:
 * - type is the key of the state or reducer's action name,
 * - value is the new value of the portion of the state defined by type.
 * setState returns new state as provided by custom reducer.
 *
 * Rules of thumb:
 * - If customReducer is not provided it will check if first argument of setState (action.type) matches with any key in the initialState.
 * - If action.type matches with any state key then the hook will update the state with given second argument of setState (action.value).
 * - If action.value is not provided and customReducer is not given it will not change state.
 * - If customReducer is provided and it returns null as default case, then the baseReducer will be used as default.
 * - If customReducer is provided and it returns unchanged state as default case then baseReducer will not be used and state will be handled
 * exactly as per provided reducer.
 * @param initialState initial state of the reducer.
 * @param customReducer optional, custom reducer functiom
 *
 * @return [ state, setState ], where state is current state and setState is function that accepts (type: string, value?: any = null);
 */

// TODO make it optionally generic type for state T
function useSmartReducer<T>(
  initialState: T,
  customReducer?: Reducer<T, Action>
): [state: T, setState: (type: string, value?: unknown) => void] {
  const reducer = makeReducer(customReducer);
  const [state, dispatch] = useReducer<Reducer<T, Action>>(
    reducer,
    initialState
  );

  const setState = useMemo(
    () => (type: string, value?: unknown): void => {
      if (customReducer || typeof value !== 'undefined') {
        dispatch({ type, value });
        return;
      }

      console.error(
        `SmartReducer: Missing action.value for '${type}'. Provide the value or pass a custom reducer.`
      );

      return;
    },
    [dispatch, customReducer]
  );

  return [state, setState];
}

export default useSmartReducer;
