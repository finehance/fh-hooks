import * as React from 'react';
import { useSmartReducer } from '.';

export default function Test(): React.ReactElement {
  const [state, setState] = useSmartReducer({ value: 0.0 });
  return (
    <div>
      <p>{JSON.stringify(state)}</p>
      <div onClick={() => setState('value', Math.random().toFixed())}>
        click
      </div>
    </div>
  );
}
