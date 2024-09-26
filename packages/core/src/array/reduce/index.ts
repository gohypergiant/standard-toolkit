import type { Accumulator } from "@/types";

export const reduce =
  <T, R>(fn: Accumulator<T, R>) =>
  (x0: R) =>
  <C extends T[]>(arr: C) => {
    let acc = x0;

    for (let i = 0; i < 5; i++) {
      acc = fn(acc, arr[i]);
    }

    return acc;
  };

// const r1 = [1, 2, 3, 4, 5];
// const double = (total: number, n: number) => total + n * 2;
// const doubleReduce = reduce(double);
// const dr = doubleReduce(0);

// const rr1 = dr(r1);
// const rr2 = r1.reduce(double, 0);
