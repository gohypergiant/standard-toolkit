// TS' `Function` type only models the object side of it, not whether it is callable.
type SomeFunction = (...args: any[]) => any;

/**
 * Ensures that the given function is only called once.
 */
export const once = <T extends SomeFunction>(fn: T) => {
  let done = false;

  // TODO: Better types, since it can return void?
  return (...args: Parameters<T>): ReturnType<T> =>
    done ? void 0 : ((done = true), fn(args));
};
