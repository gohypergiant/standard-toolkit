import { describe, test, expect } from 'vitest';
import {
  personStore,
  userStore,
  type Person,
  type City,
  type Address,
  type Profile,
  type User,
} from './__fixture__/lens-objects';
import { property, optionalProperty } from '../property';
import { associateDeep } from '../associate';
import { lens, composeLens, get, set, lensProp, lensOptionalProp } from '.';

const nameLens = lens(
  (person: Person) => property(person)('name'),
  (person) => (name) => associateDeep(person)('name')(name)
); // -> string
const addressLens = lens(
  (person: Person) => property(person)('address'),
  (person) => (addr) => associateDeep(person)('address')(addr)
); // -> Address
const cityLens = lens(
  (address?: Address) => optionalProperty(address)('city'),
  (address) => (city) => associateDeep(address as Address)('city')(city as City)
); // -> City
const profilesLens = lens(
  (user: User) => property(user)('profile'),
  (user) => (profile) => associateDeep(user)('profile')(profile)
); // -> Profile[]
const firstProfileLens = lens(
  (profiles: Profile[]) => property(profiles)(0),
  (profiles) => (profile) => associateDeep(profiles)(0)(profile)
); // -> Profile
const infoLens = lens(
  (profile: Profile) => property(profile)('info'),
  (profile) => (info) => associateDeep(profile)('info')(info)
); // -> Info

describe('lens', () => {
  test('it should correctly respect the first law: Retention (SetGet)', () => {
    const name = 'Better Name';

    expect(nameLens.get(nameLens.set(personStore)(name))).toEqual(name);
  });

  test('it should correctly respect the second law: Identity (GetSet)', () => {
    expect(nameLens.set(personStore)(nameLens.get(personStore))).toStrictEqual(
      personStore
    );
  });

  test('it should correctly respect the third law: Double Set (SetSet)', () => {
    const name1 = 'Better Name';
    const name2 = 'Best Name';

    expect(nameLens.set(nameLens.set(personStore)(name1))(name2)).toEqual(
      nameLens.set(personStore)(name2)
    );
  });

  test('it should return the correct value from the lens', () => {
    expect(nameLens.get(personStore)).toBe(personStore.name);
    expect(addressLens.get(personStore)).toStrictEqual(personStore.address);
  });

  test('it should correctly manually compose lenses', () => {
    expect(cityLens.get(addressLens.get(personStore))).toBe(
      personStore.address?.city
    );
  });

  test('it should correctly set the source value', () => {
    const val = 'Unit Test';
    const actual = nameLens.set(personStore)(val);

    expect(actual.name).toBe(val);
  });

  test('it should NOT change the source object', () => {
    const val = 'Unit Test';
    const actual = nameLens.set(personStore)(val);

    expect(actual).not.toStrictEqual(personStore);
  });
});

describe('composeLens', () => {
  test('it should correctly compose two lenses', () => {
    const personCityLens = composeLens(addressLens, cityLens);
    const userFirstProfileLens = composeLens(profilesLens, firstProfileLens);

    expect(personCityLens.get(personStore)).toBe(personStore.address?.city);
    expect(userFirstProfileLens.get(userStore)).toStrictEqual(
      userStore.profile.at(0)
    );
  });

  test('it should correctly set a composed lense value', () => {
    const city = 'San Diego';
    const personCityLens = composeLens(addressLens, cityLens);

    expect(personCityLens.get(personCityLens.set(personStore)(city))).toBe(
      city
    );
  });

  test('it should correctly compose multiple, already composed, lenses', () => {
    const personCityLens = composeLens(addressLens, cityLens);
    const userFirstProfileLens = composeLens(profilesLens, firstProfileLens);
    const userInfoLens = composeLens(userFirstProfileLens, infoLens);
    const userCityLens = composeLens(userInfoLens, personCityLens);

    expect(userCityLens.get(userStore)).toBe(
      userStore.profile.at(0)?.info.address?.city
    );
  });

  test('it should correctly set a multiple composed lense value', () => {
    const city = 'San Diego';
    const personCityLens = composeLens(addressLens, cityLens);
    const userFirstProfileLens = composeLens(profilesLens, firstProfileLens);
    const userInfoLens = composeLens(userFirstProfileLens, infoLens);
    const userCityLens = composeLens(userInfoLens, personCityLens);

    expect(userCityLens.get(userCityLens.set(userStore)(city))).toBe(city);
  });
});

describe('get', () => {
  test('it should correctly get from a lense', () => {
    expect(get(nameLens)(personStore)).toBe(personStore.name);
    expect(get(addressLens)(personStore)).toStrictEqual(personStore.address);
  });
});

describe('set', () => {
  test('it should correctly set a value in a lense', () => {
    const val = 'Unit Test';
    const actual = set(nameLens)(val)(personStore);

    expect(actual.name).toBe(val);
  });
});

describe('lenseProp', () => {
  test('it should return the correct value from the created lens', () => {
    const namePropLens = lensProp<Person>()('name');
    const addressPropLens = lensProp<Person>()('address');

    expect(namePropLens.get(personStore)).toBe(personStore.name);
    expect(addressPropLens.get(personStore)).toStrictEqual(personStore.address);
  });

  test('it should correctly manually compose created lenses', () => {
    const addressPropLens = lensProp<Person>()('address');
    const cityPropLens = lensProp<Address>()('city');

    expect(cityPropLens.get(addressPropLens.get(personStore) as Address)).toBe(
      personStore.address?.city
    );
  });

  test('it should correctly set the source value', () => {
    const val = 'Unit Test';
    const namePropLens = lensProp<Person>()('name');
    const actual = namePropLens.set(personStore)(val);

    expect(actual.name).toBe(val);
  });

  test('it should NOT change the source object', () => {
    const val = 'Unit Test';
    const namePropLens = lensProp<Person>()('name');
    const actual = namePropLens.set(personStore)(val);

    expect(actual).not.toStrictEqual(personStore);
  });
});

describe('lenseOptionalProp', () => {
  test('it should return the correct value from the created lens', () => {
    const namePropLens = lensOptionalProp<Person>()('name');
    const addressPropLens = lensOptionalProp<Person>()('address');

    expect(namePropLens.get(personStore)).toBe(personStore.name);
    expect(addressPropLens.get(personStore)).toStrictEqual(personStore.address);
  });

  test('it should correctly manually compose created lenses', () => {
    const addressPropLens = lensOptionalProp<Person>()('address');
    const cityPropLens = lensOptionalProp<Address>()('city');

    expect(cityPropLens.get(addressPropLens.get(personStore) as Address)).toBe(
      personStore.address?.city
    );
  });

  test('it should correctly set the source value', () => {
    const val = 'Unit Test';
    const namePropLens = lensOptionalProp<Person>()('name');
    const actual = namePropLens.set(personStore)(val);

    expect(actual.name).toBe(val);
  });

  test('it should NOT change the source object', () => {
    const val = 'Unit Test';
    const namePropLens = lensOptionalProp<Person>()('name');
    const actual = namePropLens.set(personStore)(val);

    expect(actual).not.toStrictEqual(personStore);
  });
});
