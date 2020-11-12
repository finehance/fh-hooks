import { useState } from 'react';
import { IObjectArray } from '..';
import { isObject } from '../utils';

export default function useObjectArray<T extends Record<string, unknown>>(
  initial: T[] = []
): IObjectArray<T> {
  let defaultArray;
  if (initial.length) {
    defaultArray = initial.filter((o) => isObject(o)).map((o) => ({ ...o }));
  } else {
    defaultArray = [];
  }

  const [array, setArray] = useState<T[]>(defaultArray);

  return {
    get values(): T[] {
      return [...array.map((o: T) => ({ ...o }))];
    },
    get isEmpty(): boolean {
      return array.length === 0;
    },
    get length(): number {
      return array.length;
    },
    hasObjectWithKeyOfValue: (key, value): boolean => {
      return array.length && array.some((obj) => obj[key] === value);
    },
    hasObjectWithKey: (key: string): boolean => {
      return array.length && array.some((obj: T) => !!obj[key as keyof T]);
    },
    filterByValue: (key: string, value: string): T[] | null => {
      return array.length && array.filter((item: T) => item[key] === value);
    },
    findOneByValue: (key: string, value: any): T | null => {
      return array.length && array.find((item: T) => item[key] === value);
    },
    add: (item: T): void => setArray((arr: T[]): T[] => [...arr, item]),
    append: (items: T[]): void => setArray((arr: T[]) => [...arr, ...items]),
    removeManyByValue: (key: string, value: any): void =>
      setArray((arr: T[]) => arr.filter((v) => v[key] !== value)),
    removeByIndex: (index: number): void =>
      setArray((arr: T[]) => arr.filter((v, i) => i !== index)),
    clear: (): void => setArray(() => []),
    replaceOne: (key: string, from: any, to: any): void =>
      setArray((arr: T[]): T[] => {
        const obj: T = arr.find((d: T) => d[key] === from);
        obj && (obj[key as keyof T] = to);

        return arr;
      }),
    replaceAll: (key: string, valueFrom: any, valueTo: any): void =>
      setArray((arr: T[]): T[] => {
        arr
          .filter((d: T) => d[key] === valueFrom)
          .forEach((obj) => {
            obj && (obj[key as keyof T] = valueTo);
          });
        return arr;
      }),
  };
}
