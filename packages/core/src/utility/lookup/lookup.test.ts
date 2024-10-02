import { expect, it, describe } from 'vitest';
import { lookup } from '.';

type Color = [number, number, number] | [number, number, number, number];

const defaultVal =
  <T>(x: T) =>
  (val: unknown) =>
    val ?? x;

const colorTable = {
  FOO: [0, 0, 255, 155] as Color,
  BAR: [255, 0, 255, 155] as Color,
  FIZZ: [230, 0, 0, 155] as Color,
  BUZZ: [0, 128, 0, 155] as Color,
  TEST: null as unknown as Color,
};

const defaultColor: Color = [128, 128, 128, 155];
const colorLookup = lookup(colorTable, defaultVal(defaultColor));
const undefLookup = lookup(colorTable);

describe('tableLookup', () => {
  it('should return the selected value', () => {
    const actualOne = colorLookup('NOPE');
    const actualTwo = colorLookup('BUZZ');

    expect(actualOne).toEqual(defaultColor);
    expect(actualTwo).toEqual(colorTable.BUZZ);
  });

  it('should return the default value for null props', () => {
    const actual = colorLookup('TEST');

    expect(actual).toEqual(defaultColor);
  });

  it('should return the default value for unknown props', () => {
    const actual = colorLookup('UNKNOWN');

    expect(actual).toEqual(defaultColor);
  });

  it('should use identity for undefined default', () => {
    const actualOne = undefLookup('UNKNOWN');
    const actualTwo = undefLookup('BAR');

    expect(actualOne).not.toBeDefined();
    expect(actualTwo).toEqual(colorTable.BAR);
  });
});
