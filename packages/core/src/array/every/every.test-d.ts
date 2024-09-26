import { test, expectTypeOf } from 'vitest';
import { every } from '.';

const isEven = (x: number) => (x & 1) === 0;
const arr = [1, 2, 3, 4];

test('it should have the correct curried types', () => {
  expectTypeOf(every).toBeFunction();
  expectTypeOf(every).toBeCallableWith(Boolean);
  expectTypeOf(every<number>).toBeCallableWith(isEven);

  expectTypeOf(every(isEven)).toBeFunction();
  expectTypeOf(every(isEven)).toBeCallableWith([]);
  expectTypeOf(every(isEven)).toBeCallableWith(arr);
});

test('it should have the correct return types', () => {
  expectTypeOf(every(isEven)(arr)).toBeBoolean();
});
