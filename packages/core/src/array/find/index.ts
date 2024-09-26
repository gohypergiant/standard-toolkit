import type { Predicate } from "@/types";

export const find =
  <T>(predicate: Predicate<T>) =>
  <C extends T[]>(arr: C) => {
    const len = arr.length;

    for (let i = 0; i < len; i++) {
      if (predicate(arr[i], i)) {
        return arr[i];
      }
    }

    return null;
  };
