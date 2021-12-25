import React from 'react';
import { renderHook } from '@testing-library/react-hooks';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { useInlineStyle } from './useInlineStyle';
import { BasicExample } from './examples/BasicExample';
import { ComplexExample } from './examples/ComplexExample';

describe('basic usage of useInlineStyle hook', () => {
  it('should return [ref, style] tuple', () => {
    const { result, unmount } = renderHook(() =>
      useInlineStyle(() => ({
        testElStyle: {
          cursor: 'pointer',
        },
      }))
    );

    const [ref, style] = result.current;

    expect(typeof style).toBe('object');
    expect(style.testElStyle).toBeDefined();
    expect(typeof style.testElStyle).toBe('object');
    expect(typeof ref).toBe('object');
    unmount();
  });

  it('can simulate :hover style on pointerOver event', async () => {
    const { getByTestId, unmount } = render(<BasicExample isMobile={false} />);

    const el = getByTestId('clicker');
    expect(el.style.color).toEqual('black');
    fireEvent.pointerOver(el);
    await waitFor(() => el);
    expect(el.style.color).toEqual('red');
    unmount();
  });

  it('can simulate :focus style on focus event', async () => {
    const { getByTestId, unmount } = render(<BasicExample isMobile={false} />);
    const el = getByTestId('clicker');
    expect(el.style.borderColor).toEqual('black');
    fireEvent.focus(el);
    await waitFor(() => el);
    expect(el.style.borderColor).toEqual('red');
    unmount();
  });

  test('can simulate :active style on pointerDown event', async () => {
    const { getByTestId, unmount } = render(<BasicExample isMobile={false} />);
    const el = getByTestId('clicker');

    expect(el.style.backgroundColor).toEqual('black');
    fireEvent.pointerDown(el);
    await waitFor(() => el);
    expect(el.style.backgroundColor).toEqual('red');
    unmount();
  });

  it('can modify style when props change', async () => {
    const { rerender, getByTestId, unmount } = render(
      <BasicExample isMobile={false} />
    );
    const el = getByTestId('clicker');

    expect(el.style.width).toEqual('200px');
    rerender(<BasicExample isMobile={true} />);
    await waitFor(() => el);
    expect(el.style.width).toEqual('90%');

    unmount();
  });
});

describe('complex case of useInlineStyle hook', () => {
  it('style object contains style for multiple elements depending on events from given ref', async () => {
    const { getByTestId, unmount } = render(<ComplexExample label={false} />);

    const referenced = getByTestId('input');
    const wrapper = getByTestId('wrapper');

    expect(referenced.style.borderColor).toEqual('#aaa');
    expect(wrapper.style.backgroundColor).toEqual('blue');

    fireEvent.pointerOver(referenced);
    await waitFor(() => referenced);

    expect(referenced.style.borderColor).toEqual('#666');
    expect(wrapper.style.backgroundColor).toEqual('white');

    unmount();
  });

  it('can simulate :focus style on focus event', async () => {
    const { getByTestId, unmount } = render(<ComplexExample label={false} />);
    const el = getByTestId('input');
    expect(el.style.boxShadow).toEqual('');
    fireEvent.focus(el);
    await waitFor(() => el);
    expect(el.style.boxShadow).toEqual('inset 0px 0px 2px #212121');
    unmount();
  });

  it('can simulate :active style on pointerDown event', async () => {
    const { getByTestId, unmount } = render(<ComplexExample label={false} />);
    const input = getByTestId('input');
    const wrapper = getByTestId('wrapper');

    expect(wrapper.style.borderColor).toEqual('white');

    fireEvent.pointerDown(input);
    await waitFor(() => input);

    expect(wrapper.style.borderColor).toEqual('red');

    unmount();
  });

  it('referenced element can still subscribe to custom events', async () => {
    const { getByTestId, unmount } = render(<ComplexExample label={false} />);
    const input = getByTestId('input');
    const validate = jest.fn();

    input.addEventListener('focus', validate);
    expect(input.style.borderColor).toEqual('#aaa');

    fireEvent.focus(input);
    await waitFor(() => input);

    expect(input.style.borderColor).toEqual('#212121');
    expect(validate).toHaveBeenCalledTimes(1);
    input.removeEventListener('focus', validate);
    unmount();
  });
});
