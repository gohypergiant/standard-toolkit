import type { Predicate } from '@/functions/types';

export const filter =
  <T>(predicate: Predicate<T>) =>
  <C extends T[]>(arr: C) => {
    const len = arr.length;
    const res: T[] = [];

    for (let i = 0; i < len; i++) {
      if (predicate(arr[i], i)) {
        res.push(arr[i]);
      }
    }

    return res;
  };
