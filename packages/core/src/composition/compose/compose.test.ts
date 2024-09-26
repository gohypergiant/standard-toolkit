import { expect, test } from 'vitest';
import { compose } from '.';

const add3 = (x: number) => x + 3;
const uppercase = (x: string) => x.toUpperCase();
const upperMap = (x: string[]) => x.map((s) => s.toUpperCase());
const splitIt = (s: string) => s.split('');
const stringify = (x: number) =>
  [
    'zero',
    'one',
    'two',
    'three',
    'four',
    'five',
    'six',
    'seven',
    'eight',
    'nine',
  ][x] ?? x.toString();

test('it should return the correct result', () => {
  const composed = compose(uppercase, stringify, add3);
  const composedTwo = compose(upperMap, splitIt, stringify, add3);

  const actualOne = composed(4);
  const actualTwo = composedTwo(4);

  expect(actualOne).toBe('SEVEN');
  expect(actualTwo).toStrictEqual(['S', 'E', 'V', 'E', 'N']);
});
