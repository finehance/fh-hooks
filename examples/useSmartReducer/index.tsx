import * as React from 'react';

export default function AComponent(): React.ReactElement {
  const [state, setState] = useSmartReducer({ a: 'a', b: 'b' });

  return <div>{JSON.stringify(state)}</div>;
}
