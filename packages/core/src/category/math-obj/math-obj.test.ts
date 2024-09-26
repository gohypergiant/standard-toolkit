import { expect, test } from 'vitest';
import { MathObj } from '.';

test('it should have correct type', async () => {
  const mod = MathObj('unit test');

  expect(mod.inspect()).toEqual('Math Object(unit test)');
  expect(mod.name).toEqual('MathObj');
});

test('it should contain value', async () => {
  const value = 342;
  const mod = MathObj(value);

  const actual = mod.__value;

  expect(actual).toEqual(value);
});
