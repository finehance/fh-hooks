import { renderHook, act } from '@testing-library/react-hooks';
import useSmartReducer from './useSmartReducer';

test('should return [state, setState] array', () => {
  const initialState = { name: 'value' };

  const { result } = renderHook(() => useSmartReducer(initialState));

  const [state, setState] = result.current;

  expect(state).toStrictEqual(initialState);
  expect(typeof setState).toBe('function');
});

test('should update state by calling setState(stateKey, newValue)', () => {
  const { result } = renderHook(() =>
    useSmartReducer({ name: 'Banana', cost: 2.5 })
  );
  expect(result.current[0]).toStrictEqual({ name: 'Banana', cost: 2.5 });
  act(() => {
    const setState = result.current[1];
    setState('name', 'Orange');
  });
  expect(result.current[0]).toStrictEqual({ name: 'Orange', cost: 2.5 });
});

test('should not change the state and console an error if action.type is not matching an initialState key and no custom reducer is provided', () => {
  const { result } = renderHook(() =>
    useSmartReducer({ name: 'Banana', cost: 2.5 })
  );
  const original = console.error;
  console.error = jest.fn();
  act(() => {
    const setState = result.current[1];
    setState('prop name not existing in the state', 'something');
  });
  expect(console.error).toBeCalled();
  expect(result.current[0]).toStrictEqual({ name: 'Banana', cost: 2.5 });
  console.error = original;
});

test('should not change the state and console an error if action.value is not given and no custom reducer is provided', () => {
  const { result } = renderHook(() =>
    useSmartReducer({ name: 'Banana', cost: 2.5 })
  );
  const original = console.error;
  console.error = jest.fn();

  act(() => {
    const setState = result.current[1];
    setState('name');
  });

  expect(console.error).toBeCalled();
  expect(result.current[0]).toStrictEqual({ name: 'Banana', cost: 2.5 });
  console.error = original;
});

test('should change the state according to custom reducer', () => {
  const { result } = renderHook(() =>
    useSmartReducer({ name: 'Banana', cost: 2.5 }, function (state, action) {
      switch (action.type) {
        case 'reset':
          return { ...state, cost: 0.0 };
        default:
          return state;
      }
    })
  );

  act(() => {
    const setState = result.current[1];
    setState('reset');
  });

  expect(result.current[0]).toStrictEqual({ name: 'Banana', cost: 0.0 });
});

test('should only use custom reducer if the reducer returns state in default case', () => {
  const { result } = renderHook(() =>
    useSmartReducer({ name: 'Banana', cost: 2.5 }, function (state, action) {
      switch (action.type) {
        case 'reset':
          return { ...state, cost: 0.0 };
        default:
          return state;
      }
    })
  );

  act(() => {
    const setState = result.current[1];
    setState('name', 'Orange');
  });

  expect(result.current[0]).toStrictEqual({ name: 'Banana', cost: 2.5 });
});

test('should setState by action.type if custom reducer returns null in default case', () => {
  const { result } = renderHook(() =>
    useSmartReducer({ name: 'Banana', cost: 2.5 }, function (state, action) {
      switch (action.type) {
        case 'reset':
          return { ...state, cost: 0.0 };
        default:
          return null;
      }
    })
  );

  act(() => {
    const setState = result.current[1];
    setState('name', 'Orange');
  });

  expect(result.current[0]).toStrictEqual({ name: 'Orange', cost: 2.5 });
});
