import * as React from 'react';
import { Action } from '..';
import useSmartReducer from './useSmartReducer';

interface TestState {
  value: number;
}
const initialState: TestState = { value: 0.0 };

function customReducer(state: TestState, action: Action) {
  switch (action.type) {
    case 'reset':
      return { ...state, value: 0.0 };
    default:
      return null;
  }
}
export default function SmartReducerTest(): React.ReactElement {
  const [state, setState] = useSmartReducer<TestState>(
    initialState,
    customReducer
  );

  return (
    <div>
      <p>{JSON.stringify(state)}</p>
      <button onClick={() => setState('value', Math.random().toFixed(2))}>
        click
      </button>
      <button onClick={() => setState('reset')}>reset</button>
    </div>
  );
}
