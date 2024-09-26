import type { Predicate } from '@/functions/types';

export const findLast =
  <T>(predicate: Predicate<T>) =>
  <C extends T[]>(arr: C) => {
    const len = arr.length;

    for (let i = len - 1; i >= 0; i--) {
      if (predicate(arr[i], i)) {
        return arr[i];
      }
    }

    return null;
  };
