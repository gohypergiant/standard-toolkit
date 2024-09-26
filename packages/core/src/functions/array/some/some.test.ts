import { expect, test } from 'vitest';
import { some } from '.';

test('it should return false for empty array', () => {
  const arr = [];
  const someBool = some(Boolean);
  const someMod = some((x: number) => x % 2 === 0);

  expect(someBool(arr)).toBe(false);
  expect(someMod(arr)).toBe(false);
});

test('it should return true for truthy predicate', () => {
  const arr = [1, 3, 6, 9, 10];
  const arr2 = [0, 0, 6, 0, 0];
  const someBool = some(Boolean);
  const someMod = some((x: number) => x % 2 === 0);

  expect(someMod(arr)).toBe(true);
  expect(someBool(arr2)).toBe(true);
});

test('it should return false for falsey predicate', () => {
  const arr = [1, 3, 5, 7, 9, 11];
  const arr2 = [0, 0, 0, 0, 0];
  const someBool = some(Boolean);
  const someMod = some((x: number) => x % 2 === 0);

  expect(someMod(arr)).toBe(false);
  expect(someBool(arr2)).toBe(false);
});
