import { renderHook } from '@testing-library/react-hooks';
import useScroll, { defaultScroll } from './useScroll';

test('should return [ref, state] array', () => {
  const { result } = renderHook(() => useScroll());
  const [ref, state] = result.current;
  expect(typeof ref).toBe('object');
  expect(state).toStrictEqual(defaultScroll);
});
