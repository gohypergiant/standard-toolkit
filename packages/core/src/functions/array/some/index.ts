import type { Comparator } from '@/functions/types';

export const some =
  <T>(comparator: Comparator<T>) =>
  <C extends T[]>(arr: C) => {
    const len = arr.length;

    for (let i = 0; i < len; i++) {
      if (comparator(arr[i])) {
        return true;
      }
    }

    return false;
  };
