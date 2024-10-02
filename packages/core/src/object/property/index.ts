/**
 * Gets the value of `prop` in `obj`. Array index support.
 *
 * @example
 * property(personStore)('address');
 * // personStore.address
 *
 * property(userStore.profile)(0);
 * // userStore.profile.at(0)
 */
export const property =
  <T extends object>(obj: T) =>
  <K extends keyof T>(prop: K) =>
    Array.isArray(obj) && Number.isFinite(Number.parseInt(prop as string, 10))
      ? (obj.at(Number.parseInt(prop as string, 10)) as T[K])
      : obj[prop];

/**
 * @alias property
 */
export const prop = property;

/**
 * Gets the optional value of `prop` in `obj`. Array index support.
 *
 * @example
 * optionalProperty(personStore)('address');
 * // personStore?.address
 *
 * optionalProperty(userStore.profile)(0);
 * // userStore?.profile?.at(0)
 */
export const optionalProperty =
  <T extends object>(obj?: T) =>
  <K extends keyof T>(prop: K): T[K] | undefined =>
    Array.isArray(obj) && Number.isFinite(Number.parseInt(prop as string, 10))
      ? (obj?.at(Number.parseInt(prop as string, 10)) as T[K])
      : obj?.[prop];

/**
 * @alias optionalProperty
 */
export const optionalProp = optionalProperty;
