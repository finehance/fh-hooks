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

test('should change the state using action.types defined only in custom reducer', () => {
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

  act(() => {
    const setState = result.current[1];
    // this should not work bacause  action.type = 'name' is not defined in custom reducer
    setState('name', 'Orange');
  });
  expect(result.current[0]).toStrictEqual({ name: 'Banana', cost: 0.0 });
});

test('should use baseReducer if custom reducer returns null in default case', () => {
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
    // this should work because custom reducer returns null as default case, allowing baseReducer to handle standard [key] mutations.
    setState('name', 'Orange');
  });

  expect(result.current[0]).toStrictEqual({ name: 'Orange', cost: 2.5 });
});

test('should not work with arrays', () => {
  const original = console.error;
  console.error = jest.fn();

  const { result } = renderHook(() => useSmartReducer([1, 2, 3] as any));

  act(() => {
    const setState = result.current[1];
    setState(0, 17);
  });

  expect(result.current[0]).toStrictEqual([1, 2, 3]);
  expect(console.error).toBeCalled();
  console.error = original;
});

test('should be able to set value to null', () => {
  const { result } = renderHook(() =>
    useSmartReducer({ changeMe: 'toSomethingElse' })
  );

  act(() => {
    const setState = result.current[1];
    setState('changeMe', null);
  });

  expect(result.current[0]).toStrictEqual({ changeMe: null });
});

test('should be able to set value to 0 (zero)', () => {
  const { result } = renderHook(() =>
    useSmartReducer({ changeMe: 'toSomethingElse' })
  );

  act(() => {
    const setState = result.current[1];
    setState('changeMe', 0);
  });

  expect(result.current[0]).toStrictEqual({ changeMe: 0 });
});

test('should be able to set value to false', () => {
  const { result } = renderHook(() =>
    useSmartReducer({ changeMe: 'toSomethingElse' })
  );

  act(() => {
    const setState = result.current[1];
    setState('changeMe', false);
  });

  expect(result.current[0]).toStrictEqual({ changeMe: false });
});

test('should not be able to set value to undefined', () => {
  const { result } = renderHook(() =>
    useSmartReducer({ changeMe: 'toSomethingElse' })
  );

  const original = console.error;
  console.error = jest.fn();

  act(() => {
    const setState = result.current[1];
    setState('changeMe', undefined);
  });

  expect(result.current[0]).toStrictEqual({ changeMe: 'toSomethingElse' });
  expect(console.error).toBeCalled();
  console.error = original;
});
