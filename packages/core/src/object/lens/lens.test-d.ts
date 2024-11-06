import { describe, test, expectTypeOf } from 'vitest';
import { personStore, type Person } from './__fixtures__/lens-objects';
import { property } from '../property';
import { associateDeep } from '../associate';
import { lens } from '.';

const nameLens = lens(
  (person: Person) => property(person)('name'),
  (person) => (name) => associateDeep(person)('name')(name),
); // -> string
const addressLens = lens(
  (person: Person) => property(person)('address'),
  (person) => (addr) => associateDeep(person)('address')(addr),
); // -> Address

describe('lens', () => {
  test('it should have the correct parameter types', () => {
    expectTypeOf(lens).toBeFunction();
    expectTypeOf(lens).toBeCallableWith(
      (x) => x,
      // eslint-disable-next-line no-unused-vars
      (x) => (_y) => x,
    );
  });

  test('it should have the correct returned types', () => {
    expectTypeOf(nameLens.get).toBeFunction();
    expectTypeOf(nameLens.set).toBeFunction();

    expectTypeOf(nameLens.get).toBeCallableWith(personStore);
    expectTypeOf(nameLens.set).toBeCallableWith(personStore);
  });

  test('it should have the correct result types', () => {
    expectTypeOf(nameLens.get(personStore)).toBeString();
    expectTypeOf(addressLens.get(personStore)).toBeNullable();
  });
});
