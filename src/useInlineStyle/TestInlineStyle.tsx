import * as React from 'react';
import useInlineStyle from './useInlineStyle';

const stylingFn = (state, props) => {
  return {
    color: state.hover ? 'red' : 'black',
    borderColor: state.focus ? 'red' : 'black',
    backgroundColor: state.active ? 'red' : 'black',
    cursor: 'pointer',
    width: props.isMobile ? '90%' : '200px',
  };
};
interface Props {
  isMobile: boolean;
}
export default function TestInlineStyle({
  isMobile,
}: Props): React.ReactElement {
  const [ref, style] = useInlineStyle<HTMLDivElement>(stylingFn, { isMobile });
  return (
    <div ref={ref} role="clicker" style={style}>
      test component
    </div>
  );
}
