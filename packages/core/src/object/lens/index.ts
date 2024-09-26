import { associateDeep } from "../associate";
import { property, optionalProperty } from "../property";

type LenseGet<T, V> = (source: T) => V;
type LenseSet<T, V> = (source: T) => (value: V) => T;

export type Lens<T, V> = {
  get: LenseGet<T, V>;
  set: LenseSet<T, V>;
};

/**
 * Focus on and manipulate a specific property or substructure within an object.
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

// * NOTE: Need to expand on this so that it functions like a normal `compose` (or `pipe` rather)
// * so one can just give it a list of lens to hop-skotch through

/**
 * Compose two lenses together.
 *
 * Given a lens `A ⭢ B` and a lens `B ⭢ C`, produces a lens `A ⭢ C`.
 *
 * @example
 * const addressLens = lens(
 *   (person: Person) => property(person)('address'),
 *   (person) => (addr) => associateDeep(person)('address')(addr)
 * );
 * const cityLens = lens(
 *   (address?: Address) => optionalProperty(address)('city'),
 *   (address) => (city) => associateDeep(address)('city')(city)
 * );
 *
 * const personCityLens = composeLens(addressLens, cityLens);
 */
export const composeLens = <A, B, C>(
  ab: Lens<A, B>,
  bc: Lens<B, C>
): Lens<A, C> => ({
  get: (a) => bc.get(ab.get(a)),
  set: (a) => (c) => ab.set(a)(bc.set(ab.get(a))(c)),
});

// Helpers

/**
 * A simple warpper function to access the `get` of a lens and the given object.
 *
 * @example
 * get(nameLens)(personStore);
 */
export const get =
  <T, V>(lensVal: Lens<T, V>) =>
  (obj: T) =>
    lensVal.get(obj);

/**
 * A simple warpper function to access the `set` of a lens and the given object..
 *
 * @example
 * set(nameLens)('Fred')(personStore);
 */
export const set =
  <T, V>(lensVal: Lens<T, V>) =>
  (value: V) =>
  (obj: T) =>
    lensVal.set(obj)(value);

// * NOTE: It hurts my head that I have to do a factory-like empty call just to get TS to play nicely.
// * Doing <T, K extends keyof T = keyof T>(prop: K) causes it to not be able to correctly infer the return value
// * And just doing <T, K extends keyof T>(prop: K) requires you to type out the prop in the generic and the function call.
// * Neither of which are ideal. So I guess this is the less of the three evils.

/**
 * Short-hand to create is simplistic get/set lens.
 *
 * @example
 * const { get, set } = lensProp<Person>()('name');
 */
export const lensProp =
  <T>() =>
  <K extends keyof T>(prop: K) =>
    lens(
      (obj: T) => property(obj)(prop),
      (obj) => (value) => associateDeep(obj)(prop)(value)
    );

/**
 * Short-hand to create is simplistic, optional, get/set lens.
 *
 * @example
 * const { get, set } = lensOptionalProp<Person>()('name');
 */
export const lensOptionalProp =
  <T>() =>
  <K extends keyof T>(prop: K) =>
    lens(
      (obj: T) => optionalProperty(obj)(prop),
      (obj) => (value) => associateDeep(obj)(prop)(value as T[K])
    );
