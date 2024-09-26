import type { Predicate } from '@/functions/types';

export const findLastIndex =
  <T>(predicate: Predicate<T>) =>
  <C extends T[]>(arr: C) => {
    const len = arr.length;

    for (let i = len - 1; i >= 0; i--) {
      if (predicate(arr[i], i)) {
        return i;
      }
    }

    return -1;
  };
