export function isObject<T>(object: T): boolean {
  return typeof object === 'object' && !Array.isArray(object) && !!object;
}

export function has<T>(object: T, key: string): boolean {
  return isObject(object) && Object.prototype.hasOwnProperty.call(object, key);
}

export function updateObject<T>(object: T, key: string, value: unknown): T {
  if (has(object, key)) {
    return { ...object, [key]: value };
  }
  // eslint-disable-next-line no-console
  console.error(
    `(fh-hooks) updateObject: Unrecognized property name: '${key}'. State was not modified.`
  );
  return object;
}

export default {
  isObject,
  has,
  updateObject,
};
