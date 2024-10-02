/**
 * Sets the `val` of `prop` in `obj`. Returning a new, shallow copy of the object.
 *
 * @example
 * associate(personStore)('address')({
 *   city: 'Austin',
 *   street: '987 Sample St',
 * });
 * // {
 * //   // ...,
 * //   city: 'Austin',
 * //   street: '987 Sample St',
 * // }
 */
export const associate =
  <T extends object>(obj: T) =>
  <K extends keyof T = keyof T>(prop: K) =>
  (val: T[K]): T => ({ ...obj, [prop]: val });

/**
 * @alias associate
 */
export const assoc = associate;

/**
 * Sets the `val` of `prop` in `obj`. Returning a new, deep copy of the object.
 *
 * @example
 * associateDeep(personStore)('address')({
 *   city: 'Austin',
 *   street: '987 Sample St',
 * });
 * // {
 * //   // ...,
 * //   city: 'Austin',
 * //   street: '987 Sample St',
 * // }
 */
export const associateDeep =
  <T extends object>(obj: T) =>
  <K extends keyof T>(prop: K) =>
  (val: T[K]): T => {
    const x = structuredClone(obj);

    x[prop] = val;

    return x;
  };

/**
 * @alias associateDeep
 */
export const assocDeep = associateDeep;
