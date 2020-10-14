import * as React from 'react';
import { useSmartReducer } from './';

const Test = (): React.ReactElement => {
  const [state, setState] = useSmartReducer({ a: 'change me', b: 'me too' });
  return (
    <div>
      <p>{JSON.stringify(state)}</p>
      <div onClick={() => setState('a', 'new a')}>change a</div>
      <div onClick={() => setState('b', 'new b')}>change b</div>
    </div>
  );
};

export default Test;
