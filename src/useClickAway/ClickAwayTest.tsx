import * as React from 'react';
import useClickAway from './useClickAway';

export default function ClickAwayTest(): React.ReactElement {
  const { ref, active, toggle } = useClickAway<HTMLDivElement>();

  return (
    <div>
      <div role='away'>away</div>
      <div role='container' ref={ref}>
        <div role='button' onClick={toggle}>
          Click
        </div>
        {active && <div className='content'>content</div>}
      </div>
    </div>
  );
}
