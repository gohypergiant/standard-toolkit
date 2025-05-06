/*
 * Copyright 2025 Hypergiant Galactic Systems Inc. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */

import { associateDeep } from '../associate';
import { optionalProperty, property } from '../property';

type LenseGet<T, V> = (source: T) => V;
type LenseSet<T, V> = (source: T) => (value: V) => T;

/**
 * A functional lense.
 *
 * @template T - The type of the object being inspected.
 * @template V - The type of the property value.
 */
export type Lens<T, V> = {
  get: LenseGet<T, V>;
  set: LenseSet<T, V>;
};

/**
 * Focus on and manipulate a specific property or substructure within an object.
 *
 * @template T - The type of the object being inspected.
 * @template V - The type of the property value.
 *
 * @param getter - The lens get function to use.
 * @param setter - The lens set function to use.
 *
 * @remarks
 * pure function
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
  setter: LenseSet<T, V>,
): Lens<T, V> => ({
  get: getter,
  set: setter,
});

// * TODO: Need to expand on this so that it functions like a normal `compose` (or `pipe` rather)
// * so one can just give it a list of lens to hop-skotch through

/**
 * Compose two lenses together.
 *
 * Given a lens `A ⭢ B` and a lens `B ⭢ C`, produces a lens `A ⭢ C`.
 *
 * @template A - The type of the first object being inspected.
 * @template B - The type of the second object being inspected.
 * @template C - The type of the property value on the second lens.
 * @param ab - The lens from A ⭢ B.
 * @param bc - The lens from B ⭢ C.
 *
 * @remarks
 * pure function
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
  bc: Lens<B, C>,
): Lens<A, C> => ({
  get: (a) => bc.get(ab.get(a)),
  set: (a) => (c) => ab.set(a)(bc.set(ab.get(a))(c)),
});

// Helpers

/**
 * A simple warpper function to access the `get` of a lens and the given object.
 *
 * @template T - The type of the object being inspected.
 * @template V - The type of the property value.
 * @param lensVal - The Lens to get the getter of.
 * @param obj - The object to focus the lens on.
 *
 * @remarks
 * pure function
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
 * @template T - The type of the object being inspected.
 * @template V - The type of the property value.
 * @param lensVal - The Lens to get the setter of.
 * @param value - The new value to set.
 * @param obj - The object to focus the lens on.
 *
 * @remarks
 * pure function
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
 * Short-hand to create a simplistic get/set lens.
 *
 * @template T - The type of the object being inspected.
 * @template K - The string template of property name of T.
 * @param prop - The prop on the focused object to access.
 *
 * @remarks
 * pure function
 *
 * @example
 * const { get, set } = lensProp<Person>()('name');
 */
export const lensProp =
  <T extends object>() =>
  <K extends keyof T>(prop: K) =>
    lens(
      (obj: T) => property(obj)(prop),
      (obj) => (value) => associateDeep(obj)(prop)(value),
    );

/**
 * Short-hand to create is simplistic, optional, get/set lens.
 *
 * @template T - The type of the object being inspected.
 * @template K - The string template of property name of T.
 * @param prop - The prop on the focused object to access.
 *
 * @remarks
 * pure function
 *
 * @example
 * const { get, set } = lensOptionalProp<Person>()('name');
 */
export const lensOptionalProp =
  <T extends object>() =>
  <K extends keyof T>(prop: K) =>
    lens(
      (obj: T) => optionalProperty(obj)(prop),
      (obj) => (value) => associateDeep(obj)(prop)(value as T[K]),
    );
