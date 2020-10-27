import { renderHook } from '@testing-library/react-hooks';
import useClickAway from './useClickAway';

test('should return {ref, active, setActive, toogle } object as payload', () => {
  const { result } = renderHook(() => useClickAway());
  const { ref, active, setActive, toggle } = result.current;
  expect(typeof ref).toBe('object');
  expect(typeof active).toBe('boolean');
  expect(typeof setActive).toBe('function');
  expect(typeof toggle).toBe('function');
});
