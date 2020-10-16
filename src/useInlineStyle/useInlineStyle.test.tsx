import React from 'react';
import { renderHook } from '@testing-library/react-hooks';
import { render, fireEvent, waitFor } from '@testing-library/react';
import useInlineStyle from './useInlineStyle';
import TestInlineStyle from './TestInlineStyle';

test('should return [ref, style] array', () => {
  const { result, unmount } = renderHook(() =>
    useInlineStyle(() => ({
      cursor: 'pointer',
    }))
  );

  const [ref, style] = result.current;

  expect(typeof style).toBe('object');
  expect(typeof ref).toBe('object');
  unmount();
});

test('can simulate :hover style on pointerOver event', async () => {
  const { getByRole, unmount } = render(<TestInlineStyle isMobile={false} />);

  expect(getByRole('clicker').style.color).toEqual('black');
  fireEvent.pointerOver(getByRole('clicker'));
  await waitFor(() => getByRole('clicker'));
  expect(getByRole('clicker').style.color).toEqual('red');
  unmount();
});

test('can simulate :focus style on focus event', async () => {
  const { getByRole, unmount } = render(<TestInlineStyle isMobile={false} />);

  expect(getByRole('clicker').style.borderColor).toEqual('black');
  fireEvent.focus(getByRole('clicker'));
  await waitFor(() => getByRole('clicker'));
  expect(getByRole('clicker').style.borderColor).toEqual('red');
  unmount();
});

test('can simulate :active style on pointerDown event', async () => {
  const { getByRole, unmount } = render(<TestInlineStyle isMobile={false} />);

  expect(getByRole('clicker').style.backgroundColor).toEqual('black');
  fireEvent.pointerDown(getByRole('clicker'));
  await waitFor(() => getByRole('clicker'));
  expect(getByRole('clicker').style.backgroundColor).toEqual('red');
  unmount();
});

test('can modify style when props change', async () => {
  const { rerender, getByRole, unmount } = render(
    <TestInlineStyle isMobile={false} />
  );

  expect(getByRole('clicker').style.width).toEqual('200px');
  rerender(<TestInlineStyle isMobile={true} />);
  await waitFor(() => getByRole('clicker'));
  expect(getByRole('clicker').style.width).toEqual('90%');

  unmount();
});
