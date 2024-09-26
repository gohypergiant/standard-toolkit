import { expect, test } from 'vitest';
import { pipe } from '.';

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
  const piped = pipe(add3, stringify, uppercase, splitIt);
  const pipedTwo = pipe(add3, stringify, splitIt, upperMap, (a: string[]) =>
    a.join('')
  );

  const actualOne = piped(3);
  const actualTwo = pipedTwo(3);

  expect(actualOne).toStrictEqual(['S', 'I', 'X']);
  expect(actualTwo).toBe('SIX');
});
