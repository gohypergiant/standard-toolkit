/* eslint-disable @typescript-eslint/no-explicit-any */
// https://github.com/type-challenges/type-challenges/issues/15988

export type Curried<T extends unknown[], R> = <P extends Partial<T>>(
  ...args: P
) => ((...args: T) => any) extends (...args: [...P, ...infer Args]) => any
  ? Args extends []
    ? R
    : Curried<Args, R>
  : never;

/**
 * Curries the given function. Allowing it to be accept one or more arguments at a time.
 *
 * @example
 * const curried = autoCurry((a, b, c) => (a + b) * c);
 * curried(2)(3)(4);
 * curried(2, 3)(4);
 * curried(2)(3, 4);
 * curried(2, 3, 4);
 */
export function autoCurry<T extends (...args: any[]) => any>(
  fn: T,
  _args = [] as any[]
): Curried<Parameters<T>, ReturnType<T>> {
  return (...__args) =>
    ((rest) => (rest.length >= fn.length ? fn(...rest) : autoCurry(fn, rest)))([
      ..._args,
      ...__args,
    ]);
}
