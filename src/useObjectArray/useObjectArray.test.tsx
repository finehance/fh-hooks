import { renderHook, act } from '@testing-library/react-hooks';
import useObjectArray from './useObjectArray';

const testArray = [
  { id: 'one', a: 'a', b: 'b', c: 'c' },
  { id: 'two', a: 'aa', b: 'bb', c: 'cc' },
  { id: 'three', a: 'aaa', b: 'bbb', c: 'ccc' },
  { id: 'duplicateA', a: 'a', b: 'bbb', c: 'ccc' },
];

describe('useObjectArray hook', () => {
  test('mutating objects in returned array.values does not mutate the array', () => {
    const { result, unmount } = renderHook(() => useObjectArray(testArray));

    const docs = result.current.values;

    docs.forEach((obj) => {
      obj.a = 'zzz';
    });

    expect(result.current.values).toEqual([
      { id: 'one', a: 'a', b: 'b', c: 'c' },
      { id: 'two', a: 'aa', b: 'bb', c: 'cc' },
      { id: 'three', a: 'aaa', b: 'bbb', c: 'ccc' },
      { id: 'duplicateA', a: 'a', b: 'bbb', c: 'ccc' },
    ]);

    expect(docs).toEqual([
      { id: 'one', a: 'zzz', b: 'b', c: 'c' },
      { id: 'two', a: 'zzz', b: 'bb', c: 'cc' },
      { id: 'three', a: 'zzz', b: 'bbb', c: 'ccc' },
      { id: 'duplicateA', a: 'zzz', b: 'bbb', c: 'ccc' },
    ]);
    unmount();
  });

  test('it removes all array elements that are not object on init', () => {
    const mixedArray = [
      { a: 'value', b: 123 },
      124,
      'string',
      null,
      { b: '213', a: 'something' },
    ];
    const { result, unmount } = renderHook(() =>
      useObjectArray<any>(mixedArray)
    );

    expect(result.current.values.length).toEqual(2);
    unmount();
  });

  test('it initializes with empty array if no initial value is provided', () => {
    const { result, unmount } = renderHook(() => useObjectArray<any>());

    expect(result.current.values.length).toEqual(0);
    unmount();
  });

  test('values returns a copy of actual array', () => {
    const { result, unmount } = renderHook(() => useObjectArray(testArray));

    expect(result.current.values).toEqual(testArray);
    expect(result.current.values).not.toBe(testArray);
    unmount();
  });
  test('isEmpty checks if array is empty, length gives length of the array', () => {
    const { result, unmount } = renderHook(() => useObjectArray<any>());

    expect(result.current.isEmpty).toEqual(true);
    expect(result.current.length).toEqual(0);

    act(() => {
      result.current.add({ a: 'value' });
    });

    expect(result.current.isEmpty).toEqual(false);
    expect(result.current.length).toEqual(1);

    unmount();
  });
  test('hasObjectWithKey checks if array has at least one object with particular property', () => {
    const { result, unmount } = renderHook(() => useObjectArray(testArray));

    expect(result.current.hasObjectWithKey('c')).toEqual(true);
    expect(result.current.hasObjectWithKey('d')).toEqual(false);
    unmount();
  });

  test('filterByValue filters objects that have key properties with given values', () => {
    const { result, unmount } = renderHook(() => useObjectArray(testArray));

    expect(result.current.filterByValue('c', 'cc').length).toEqual(1);
    expect(result.current.filterByValue('c', 'cc')).toEqual([
      { id: 'two', a: 'aa', b: 'bb', c: 'cc' },
    ]);

    unmount();
  });

  test('findOneByValue returns the first object that has key properties with given value', () => {
    const { result, unmount } = renderHook(() => useObjectArray(testArray));

    expect(result.current.findOneByValue('c', 'cc')).toEqual({
      id: 'two',
      a: 'aa',
      b: 'bb',
      c: 'cc',
    });

    unmount();
  });

  test('it does its job while not mutating objects of initial array passed in declaration', () => {
    const { result, unmount } = renderHook(() => useObjectArray(testArray));

    const obj = { id: 'four', a: 'aaaa', b: 'bbbb', c: 'cccc' };

    act(() => {
      result.current.add(obj);
      result.current.replaceOne('id', 'two', 'wat');
    });
    expect(testArray.length).toEqual(4);
    expect(testArray.find((d) => d.id === 'wat')).toEqual(undefined);
    expect(result.current.values.length).toEqual(5);
    expect(result.current.hasObjectWithKeyOfValue('id', 'wat')).toBe(true);
    unmount();
  });

  test('should not mutate if operations are made directly on array.values', () => {
    const { result, unmount } = renderHook(() => useObjectArray(testArray));

    act(() => {
      (result.current as any).values.push({ dont: 'wrong' });
    });

    expect(result.current.values).toEqual(testArray);

    act(() => {
      result.current.values.splice(0, 1);
    });

    expect(result.current.values).toEqual(testArray);
    unmount();
  });

  test('add() adds item to array', () => {
    const { result, unmount } = renderHook(() => useObjectArray(testArray));

    expect(typeof result.current.add).toBe('function');

    const obj = { id: 'four', a: 'aaaa', b: 'bbbb', c: 'cccc' };
    act(() => {
      result.current.add(obj);
    });

    expect(result.current.values).toEqual([...testArray, obj]);
    unmount();
  });

  test('append() appends multiple items to end of array', () => {
    const { result, unmount } = renderHook(() => useObjectArray(testArray));
    expect(typeof result.current.append).toBe('function');

    const four = { id: 'four', a: 'aaaa', b: 'bbbb', c: 'cccc' };
    const five = { id: 'five', a: 'aaaaa', b: 'bbbbb', c: 'ccccc' };

    act(() => {
      result.current.append([four, five]);
    });

    expect(result.current.values).toEqual([...testArray, four, five]);
    unmount();
  });

  test('hasObjectWithKeyOfValue() tests if any object in the array contains given key-value pair', () => {
    const { result, unmount } = renderHook(() => useObjectArray(testArray));
    const array = result.current;
    expect(array.hasObjectWithKeyOfValue('a', 'aaa')).toBe(true);
    expect(array.hasObjectWithKeyOfValue('a', 'zzz')).toBe(false);
    expect(array.hasObjectWithKeyOfValue('xxx', 'value')).toBe(false);
    expect(array.hasObjectWithKeyOfValue('', 'value')).toBe(false);
    expect(array.hasObjectWithKeyOfValue('b', 'b')).toBe(true);
    unmount();
  });

  test('removeManyByValue() removes matching item or items from array', () => {
    const { result, unmount } = renderHook(() => useObjectArray(testArray));

    expect(typeof result.current.removeManyByValue).toBe('function');

    act(() => {
      result.current.removeManyByValue('a', 'a');
    });

    expect(result.current.values).toEqual([
      { id: 'two', a: 'aa', b: 'bb', c: 'cc' },
      { id: 'three', a: 'aaa', b: 'bbb', c: 'ccc' },
    ]);

    expect(result.current.length).toBe(2);
    unmount();
  });

  test('it removes item from array by index', () => {
    const { result, unmount } = renderHook(() => useObjectArray(testArray));

    expect(typeof result.current.removeByIndex).toBe('function');

    act(() => {
      result.current.removeByIndex(1);
    });

    expect(result.current.values).toEqual([
      { id: 'one', a: 'a', b: 'b', c: 'c' },
      // {id: 'two', a: 'aa', b: 'bb', c: 'cc'},
      { id: 'three', a: 'aaa', b: 'bbb', c: 'ccc' },
      { id: 'duplicateA', a: 'a', b: 'bbb', c: 'ccc' },
    ]);
    unmount();
  });

  test('it clears all items from array', () => {
    const { result, unmount } = renderHook(() => useObjectArray(testArray));

    expect(typeof result.current.clear).toBe('function');

    act(() => {
      result.current.clear();
    });

    expect(result.current.values).toEqual([]);
    unmount();
  });

  test('given specified key, it replaces its source value to target value, for first matching object', () => {
    const { result, unmount } = renderHook(() => useObjectArray(testArray));

    expect(typeof result.current.replaceOne).toBe('function');

    act(() => {
      result.current.replaceOne('a', 'a', 'valueZ');
    });

    expect(result.current.values).toEqual([
      { id: 'one', a: 'valueZ', b: 'b', c: 'c' },
      { id: 'two', a: 'aa', b: 'bb', c: 'cc' },
      { id: 'three', a: 'aaa', b: 'bbb', c: 'ccc' },
      { id: 'duplicateA', a: 'a', b: 'bbb', c: 'ccc' },
    ]);
    unmount();
  });

  test('given specified key, it replaces its source value to target value, for all matching objects', () => {
    const { result, unmount } = renderHook(() => useObjectArray(testArray));

    expect(typeof result.current.replaceOne).toBe('function');

    act(() => {
      result.current.replaceAll('a', 'a', 'valueZ');
    });

    expect(result.current.values).toEqual([
      { id: 'one', a: 'valueZ', b: 'b', c: 'c' },
      { id: 'two', a: 'aa', b: 'bb', c: 'cc' },
      { id: 'three', a: 'aaa', b: 'bbb', c: 'ccc' },
      { id: 'duplicateA', a: 'valueZ', b: 'bbb', c: 'ccc' },
    ]);
    unmount();
  });
});

describe('weird cases of useObjectArray hook', () => {
  test('handles falsy keys properly', () => {
    const weird = [
      { '': 'wat' },
      { null: 'watwat' },
      { undefined: 'watwatwat' },
      { 0: 'waaat' },
    ];
    const { result, unmount } = renderHook(() => useObjectArray(weird));
    const array: any = result.current;
    expect(array.hasObjectWithKeyOfValue('', 'wat')).toBe(true);
    expect(array.hasObjectWithKeyOfValue('', 'not')).toBe(false);

    expect(array.hasObjectWithKeyOfValue(null, 'watwat')).toBe(true);
    expect(array.hasObjectWithKeyOfValue(null, 'not')).toBe(false);
    expect(array.hasObjectWithKeyOfValue(undefined, 'watwatwat')).toBe(true);
    expect(array.hasObjectWithKeyOfValue(undefined, 'not')).toBe(false);
    expect(array.hasObjectWithKeyOfValue(0, 'waaat')).toBe(true);
    expect(array.hasObjectWithKeyOfValue(0, 'not')).toBe(false);
    unmount();
  });

  test('handles nulls in initial array', () => {
    const weird = [{ a: '' }, { b: null }, null, { c: 0 }, 'a', {}];
    const { result, unmount } = renderHook(() => useObjectArray<any>(weird));

    expect(result.current.values.length).toEqual(4);
    expect(result.current.hasObjectWithKeyOfValue('a', '')).toBe(true);
    expect(result.current.hasObjectWithKeyOfValue('b', null)).toBe(true);
    expect(result.current.hasObjectWithKeyOfValue('c', 0)).toBe(true);
    unmount();
  });

  test('handles falsy values properly', () => {
    const weird = [{ a: '' }, { b: null }, { c: undefined }, { d: 0 }];
    const { result, unmount } = renderHook(() => useObjectArray(weird));
    const array = result.current;

    expect(array.hasObjectWithKeyOfValue('a', '')).toBe(true);
    expect(array.hasObjectWithKeyOfValue('b', null)).toBe(true);
    expect(array.hasObjectWithKeyOfValue('c', undefined)).toBe(true);
    expect(array.hasObjectWithKeyOfValue('d', 0)).toBe(true);
    unmount();
  });
});
