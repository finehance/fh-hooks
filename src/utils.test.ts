/* eslint-disable no-console */

import { has, isObject, updateObject } from './utils';

test('isObject() should return true only if a value is an Object {}', () => {
  class MySchema {
    a: string;
    b: string;

    constructor() {
      this.a = 'a';
      this.b = 'b';
    }
  }
  expect(isObject({})).toEqual(true);
  expect(isObject({ hello: 'world' })).toEqual(true);
  expect(isObject(Object.create(null))).toEqual(true);
  // should be false ?
  expect(isObject(new MySchema())).toEqual(true);
  expect(isObject(new Map())).toEqual(true);
  expect(isObject(new Set())).toEqual(true);
});

test('isObject() should return false only if a value is not an Object {}', () => {
  expect(isObject([])).toEqual(false);
  expect(isObject(() => {})).toEqual(false);
  expect(isObject(null)).toEqual(false);
  expect(isObject(undefined)).toEqual(false);
  expect(isObject('')).toEqual(false);
  expect(isObject(0)).toEqual(false);
  expect(isObject(NaN)).toEqual(false);
});

test('has() tests if an object has a property with particular name', () => {
  expect(has({ a: 'value' }, 'a')).toBe(true);
  expect(has({ a: 'value' }, 'b')).toBe(false);
});

test('updateObject() sets a value of property for given object', () => {
  expect(updateObject({ a: 'value' }, 'a', 'newValue')).toStrictEqual({
    a: 'newValue',
  });
});

test('updateObject() does not modify object if it has no property with given name and shows console error message.', () => {
  const original = console.error;
  console.error = jest.fn();

  let obj = { a: 'value' };

  obj = updateObject({ a: 'value' }, 'b', 'newValue');

  expect(console.error).toBeCalled();
  expect(obj).toStrictEqual({ a: 'value' });
  console.error = original;
});
