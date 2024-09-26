import { expect, test } from 'vitest';
import { filter } from './';

const isEven = (x: number) => (x & 1) === 0;
const isOdd = (x: number) => !isEven(x);
const arr = [0, 1, 2, 3, 4, 5, 6];

test('it should return the correct filtered array', () => {
  const filterEven = filter(isEven);
  const filterOdd = filter(isOdd);

  expect(filterEven(arr)).toStrictEqual([0, 2, 4, 6]);
  expect(filterOdd(arr)).toStrictEqual([1, 3, 5]);
});
