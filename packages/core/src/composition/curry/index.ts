/* eslint-disable @typescript-eslint/no-explicit-any */
// https://github.com/type-challenges/type-challenges/issues/15988

export type Curried<T extends unknown[], R> = <P extends Partial<T>>(
  ...args: P
) => ((...args: T) => any) extends (...args: [...P, ...infer Args]) => any
  ? Args extends []
    ? R
    : Curried<Args, R>
  : never;

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
