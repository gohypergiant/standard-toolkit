// TS' `Function` type only models the object side of it, not whether it is callable.
type SomeFunction = (...args: any[]) => any;

/**
 * Ensures that the given function is only called once.
 */
export const once = <T extends SomeFunction>(fn: T) => {
  let done = false;

  // TODO: Better types, since it can return void?
  // biome-ignore lint/suspicious/noConfusingVoidType: <explanation>
  return (...args: Parameters<T>): ReturnType<T> | void =>
    // biome-ignore lint/suspicious/noAssignInExpressions: Shhhh
    // biome-ignore lint/style/noCommaOperator: Shhh
    done ? void 0 : ((done = true), fn(args));
};
