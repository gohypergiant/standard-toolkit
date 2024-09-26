import { property, optionalProperty } from '../property';
import { associateDeep } from '../associate';

type LenseGet<T, V> = (source: T) => V;
type LenseSet<T, V> = (source: T) => (value: V) => T;

export type Lens<T, V> = {
  get: LenseGet<T, V>;
  set: LenseSet<T, V>;
};

/**
 *
 * @example
 * const nameLens = lens(
 *   (person: Person) => person.name,
 *   (person, name) => ({ ...person, name })
 * );
 *
 * const name = nameLens.get(person);
 *
 * const { get: getUsername, set: setUsername } = lens(
 *   (user: User) => property(user)('username'),
 *   (user, name) => associateDeep(user)('username')(name)
 * );
 *
 * const username = getUsername(user);
 */
export const lens = <T, V>(
  getter: LenseGet<T, V>,
  setter: LenseSet<T, V>
): Lens<T, V> => ({
  get: getter,
  set: setter,
});

// Need to expand on this so that it functions like a normal `compose` (or `pipe` rather)
// so one can just give it a list of lens to hop-skotch through
export const composeLens = <A, B, C>(
  ab: Lens<A, B>,
  bc: Lens<B, C>
): Lens<A, C> => ({
  get: (a) => bc.get(ab.get(a)),
  set: (a) => (c) => ab.set(a)(bc.set(ab.get(a))(c)),
});

// Helpers

export const get =
  <T, V>(lens: Lens<T, V>) =>
  (obj: T) =>
    lens.get(obj);

export const set =
  <T, V>(lens: Lens<T, V>) =>
  (value: V) =>
  (obj: T) =>
    lens.set(obj)(value);

// * NOTE: It hurts my head that I have to do a factory-like empty call just to get TS to play nicely.
// * Doing <T, K extends keyof T = keyof T>(prop: K) causes it to not be able to correctly infer the return value
// * And just doing <T, K extends keyof T> requires you to type out the prop in the generic and the call.
// * Neither of which are ideal. So I guess this is the less of the three evils.
export const lensProp =
  <T>() =>
  <K extends keyof T>(prop: K) =>
    lens(
      (obj: T) => property(obj)(prop),
      (obj) => (value) => associateDeep(obj)(prop)(value)
    );

export const lensOptionalProp =
  <T>() =>
  <K extends keyof T>(prop: K) =>
    lens(
      (obj: T) => optionalProperty(obj)(prop),
      (obj) => (value) => associateDeep(obj)(prop)(value as T[K])
    );
