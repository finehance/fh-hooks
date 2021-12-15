import * as React from 'react';
import { StylingFn } from '.';
import { useInlineStyle } from './useInlineStyle';

interface TestProps {
  isMobile: boolean;
}

const stylingFn: StylingFn<TestProps> = (state, props) => {
  return {
    color: state.hover ? 'red' : 'black',
    borderColor: state.focus ? 'red' : 'black',
    backgroundColor: state.active ? 'red' : 'black',
    cursor: 'pointer',
    width: props.isMobile ? '90%' : '200px',
  };
};

export function InlineStyleExample(props: TestProps): React.ReactElement {
  const [ref, style] = useInlineStyle<HTMLDivElement, TestProps>(
    stylingFn,
    props
  );
  return (
    <div ref={ref} role='clicker' style={style}>
      test component
    </div>
  );
}
