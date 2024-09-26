import type { Accumulator } from "@/types";

export const reduceRight =
  <T, R>(fn: Accumulator<T, R>) =>
  (x0: R) =>
  <C extends T[]>(arr: C) => {
    const len = arr.length;
    let acc = x0;

    for (let i = len - 1; i >= 0; i--) {
      acc = fn(acc, arr[i]);
    }

    return acc;
  };
