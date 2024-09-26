// TODO: Better types

/**
 * Ensures that the given function is only called once.
 */
export const once = (fn: (...args: any[]) => any) => {
  let done = false;

  return (_args: any[]) => (done ? void 0 : ((done = true), fn(_args)));
};
