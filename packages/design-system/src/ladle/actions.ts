import { action } from '@ladle/react';

export function actions<T>(...keys: (keyof T)[]): Partial<T> {
  return keys.reduce<Partial<T>>((acc, key) => {
    acc[key] = action(key as string) as T[keyof T];

    return acc;
  }, {});
}
