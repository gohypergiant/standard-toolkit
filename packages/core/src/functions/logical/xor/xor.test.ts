import { expect, test, describe } from 'vitest';
import { xor, xorFn } from '.';

const isEven = (x: number) => (x & 1) === 0;
const isOdd = (x: number) => !isEven(x);

describe('xor', () => {
  test('it should return true for true | false', () => {
    const actual = xor(true)(false);

    expect(actual).toBe(true);
  });

  test('it should return true for false | true', () => {
    const actual = xor(false)(true);

    expect(actual).toBe(true);
  });

  test('it should return false for true | true', () => {
    const actual = xor(true)(true);

    expect(actual).toBe(false);
  });

  test('it should return false for false | false', () => {
    const actual = xor(false)(false);

    expect(actual).toBe(false);
  });
});

describe('xorFn', () => {
  test('it should return true for true | false', () => {
    const actual = xorFn(isEven)(isOdd)(4);

    expect(actual).toBe(true);
  });

  test('it should return true for false | true', () => {
    const actual = xorFn(isOdd)(isEven)(4);

    expect(actual).toBe(true);
  });

  test('it should return false for true | true', () => {
    const actual = xorFn(isEven)(isEven)(4);

    expect(actual).toBe(false);
  });

  test('it should return false for false | false', () => {
    const actual = xorFn(isOdd)(isOdd)(4);

    expect(actual).toBe(false);
  });
});
