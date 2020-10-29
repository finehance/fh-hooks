import * as React from 'react';
import useScroll from './useScroll';

export default function TestScroll(): React.ReactElement {
  const [ref, scrollState] = useScroll<HTMLDivElement>();
  return (
    <div ref={ref} style={{ height: '1000px' }} role="container">
      test component
      <p>{JSON.stringify(scrollState)}</p>
    </div>
  );
}
