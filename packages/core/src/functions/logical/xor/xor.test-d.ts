import { test, describe, expectTypeOf } from 'vitest';
import { xor, xorFn } from '.';

const isEven = (x: number) => (x & 1) === 0;
const isOdd = (x: number) => !isEven(x);

describe('xor', () => {
  test('it should have the correct curried types', () => {
    expectTypeOf(xor).toBeFunction();
    expectTypeOf(xor).toBeCallableWith(0);
    expectTypeOf(xor).toBeCallableWith('');
    expectTypeOf(xor).toBeCallableWith(false);

    expectTypeOf(xor(false)).toBeFunction();
    expectTypeOf(xor(false)).toBeCallableWith(0);
    expectTypeOf(xor(false)).toBeCallableWith('');
    expectTypeOf(xor(false)).toBeCallableWith(false);
  });

  test('it should have the correct return types', () => {
    expectTypeOf(xor(5)(0)).toBeBoolean();
    expectTypeOf(xor('')(0)).toBeBoolean();
    expectTypeOf(xor(5)(false)).toBeBoolean();
  });
});

describe('xorFn', () => {
  test('it should have the correct curried types', () => {
    expectTypeOf(xorFn).toBeFunction();
    expectTypeOf(xorFn<number>).toBeCallableWith(isEven);
    expectTypeOf(xorFn<number>).toBeCallableWith(isOdd);

    expectTypeOf(xorFn(isEven)).toBeFunction();
    expectTypeOf(xorFn(isEven)).toBeCallableWith(isEven);
    expectTypeOf(xorFn(isEven)).toBeCallableWith(isOdd);

    expectTypeOf(xorFn(isEven)(isOdd)).toBeCallableWith(0);
    expectTypeOf(xorFn(isEven)(isOdd)).toBeCallableWith(94);
  });

  test('it should have the correct return types', () => {
    expectTypeOf(xorFn(isEven)(isOdd)(4)).toBeBoolean();
    expectTypeOf(xorFn(isOdd)(isEven)(4)).toBeBoolean();
    expectTypeOf(xorFn(isOdd)(isOdd)(4)).toBeBoolean();
  });
});
