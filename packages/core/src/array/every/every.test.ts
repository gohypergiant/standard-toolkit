import { expect, test } from 'vitest';
import { every } from '.';

const isEven = (x: number) => (x & 1) === 0;

test('it should return true for empty array', () => {
  const arr = [];
  const everyBool = every(Boolean);
  const everyMod = every(isEven);

  expect(everyBool(arr)).toBeTruthy();
  expect(everyMod(arr)).toBeTruthy();
});

test('it should return true for truthy predicate', () => {
  const arr = [2, 4, 6, 8, 10];
  const everyBool = every(Boolean);
  const everyMod = every(isEven);

  expect(everyBool(arr)).toBeTruthy();
  expect(everyMod(arr)).toBeTruthy();
});

test('it should return false for falsey predicate', () => {
  const arr = [0, 3, 5, 7, 9, 11];
  const everyBool = every(Boolean);
  const everyMod = every(isEven);

  expect(everyBool(arr)).not.toBeTruthy();
  expect(everyMod(arr)).not.toBeTruthy();
});
