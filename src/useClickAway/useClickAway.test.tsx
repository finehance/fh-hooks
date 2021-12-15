import * as React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { renderHook, act } from '@testing-library/react-hooks';
import { useClickAway } from './useClickAway';
import { ClickAwayExample } from './ClickAwayExample';

test('should return {ref, active, setActive, toogle } object as payload', () => {
  const { result, unmount } = renderHook(() => useClickAway());
  const { ref, active, setActive, toggle } = result.current;
  expect(typeof ref).toBe('object');
  expect(typeof active).toBe('boolean');
  expect(typeof setActive).toBe('function');
  expect(typeof toggle).toBe('function');
  unmount();
});

test('should change active state on calling toggle function', () => {
  const { result, unmount } = renderHook(() => useClickAway());
  expect(result.current.active).toEqual(false);
  act(() => {
    result.current.toggle();
  });
  expect(result.current.active).toEqual(true);
  unmount();
});

test('should change active state on calling setActive()', () => {
  const { result, unmount } = renderHook(() => useClickAway());
  expect(result.current.active).toEqual(false);
  act(() => {
    result.current.setActive(true);
  });
  expect(result.current.active).toEqual(true);
  act(() => {
    result.current.setActive(false);
  });
  expect(result.current.active).toEqual(false);

  unmount();
});

test('sets active to false if pointerdown event is triggered by the document, where target is not a child of referred element', async () => {
  const { getByRole } = render(<ClickAwayExample />);

  fireEvent.click(getByRole('button'));
  await waitFor(() => getByRole('button'));
  // console.log();
  expect(getByRole('container').getElementsByClassName('content').length).toBe(
    1
  );

  fireEvent.pointerDown(getByRole('away'));
  await waitFor(() => getByRole('away'));
  expect(getByRole('container').getElementsByClassName('content').length).toBe(
    0
  );
});

test('sets active to false if pointer event is triggered by the document, where target is not a child of referred element', async () => {
  const { getByRole } = render(<ClickAwayExample />);

  fireEvent.click(getByRole('button'));
  await waitFor(() => getByRole('button'));
  // console.log();
  expect(getByRole('container').getElementsByClassName('content').length).toBe(
    1
  );

  fireEvent.pointerDown(getByRole('away'));
  await waitFor(() => getByRole('away'));
  expect(getByRole('container').getElementsByClassName('content').length).toBe(
    0
  );
});
