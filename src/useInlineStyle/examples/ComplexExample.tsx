import * as React from 'react';
import { StyleState } from '..';
import { useInlineStyle } from '../useInlineStyle';

interface TestProps {
  label: boolean;
}

function stylingFn(
  { focus, hover, active }: Partial<StyleState>,
  { label }: TestProps
): Record<string, React.CSSProperties> {
  return {
    wrapper: {
      backgroundColor: hover ? 'white' : 'blue',
      borderColor: active ? 'red' : 'white',
    },
    label: {
      position: 'absolute',
      left: label ? '12px' : 0,
      fontSize: '0.75rem',
    },
    input: {
      backgroundColor: 'white !important',
      margin: label ? '20px 0px 32px 0px' : '0px 0px 32px 0px',
      padding: '12px 12px',
      fontSize: '0.85rem',
      border: '1px solid',
      borderRadius: '6px',
      borderColor: focus ? '#212121' : hover ? '#666' : '#aaa',
      boxShadow: focus ? 'inset 0px 0px 2px #212121' : undefined,
    },
    error: {
      position: 'absolute',
      bottom: '12px',
      paddingLeft: '12px',
      left: '0px',
      borderBottom: '1px solid #d30000',
      borderLeft: '1px solid #d30000',
      color: '#d30000',
      fontSize: '0.75rem',
      lineHeight: '1.0rem',
    },
  };
}
export function ComplexExample(props: TestProps): React.ReactElement {
  const [ref, style] = useInlineStyle<HTMLInputElement, TestProps>(
    stylingFn,
    props
  );
  return (
    <div data-testid='wrapper' style={style.wrapper}>
      {props.label && (
        <label data-testid='label' style={style.label} htmlFor='field-text'>
          label
        </label>
      )}
      <input
        data-testid='input'
        ref={ref}
        style={style.input}
        type='text'
        id='field-text'
      />
      <span data-testid='error' style={style.error}>
        error
      </span>
    </div>
  );
}
