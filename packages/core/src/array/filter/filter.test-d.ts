import { test, expectTypeOf } from 'vitest';
import { filter } from './';

const isEven = (x: number) => (x & 1) === 0;
const arr = [0, 1, 2, 3, 4, 5, 6];

test('it should have the correct curried types', () => {
  expectTypeOf(filter).toBeFunction();
  expectTypeOf(filter<number>).toBeCallableWith(isEven);

  expectTypeOf(filter(isEven)).toBeFunction();
  expectTypeOf(filter(isEven)).toBeCallableWith([]);
  expectTypeOf(filter(isEven)).toBeCallableWith(arr);
});

test('it should have the correct return types', () => {
  expectTypeOf(filter(isEven)(arr)).toBeArray();
});
