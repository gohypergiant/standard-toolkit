import type { Predicate } from '@/functions/types';

export const findIndex =
  <T>(predicate: Predicate<T>) =>
  <C extends T[]>(arr: C) => {
    const len = arr.length;

    for (let i = 0; i < len; i++) {
      if (predicate(arr[i], i)) {
        return i;
      }
    }

    return -1;
  };
