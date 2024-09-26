/**
 * Calls the given function with the given value and returns the value.
 *
 * @signature tap :: (a -> b) -> a -> a
 *
 * @example
 * tap(console.log)('foobar') // foobar
 */
export const tap =
  <T, R>(fn: (v: T) => R) =>
  (val: T) => {
    fn(val);

    return val;
  };
