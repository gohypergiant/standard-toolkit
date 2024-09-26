import { expect, test, describe } from 'vitest';
import { equality, equalityFn } from '.';

const a = 5;
const b = 5;
const c = 8;

const addTwo = (val: number) => val + 2;
const subThree = (val: number) => val - 3;

describe('equality', () => {
  test('it should return true for a === b', () => {
    const actual = equality(a)(b);

    expect(actual).toBe(true);
  });

  test('it should return false for a === c', () => {
    const actual = equality(a)(c);

    expect(actual).toBe(false);
  });

  test('it should return false for c === b', () => {
    const actual = equality(c)(a);

    expect(actual).toBe(false);
  });
});

describe('equalityFn', () => {
  test('it should return true for addTwo(a) === addTwo(a)', () => {
    const actual = equalityFn(addTwo)(addTwo)(a);

    expect(actual).toBe(true);
  });

  test('it should return false for addTwo(b) === subThree(b)', () => {
    const actual = equalityFn(addTwo)(subThree)(b);

    expect(actual).toBe(false);
  });

  test('it should return false for subThree(b) === addTwo(b)', () => {
    const actual = equalityFn(subThree)(addTwo)(b);

    expect(actual).toBe(false);
  });
});
