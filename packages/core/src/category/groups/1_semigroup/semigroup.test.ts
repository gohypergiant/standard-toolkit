import { expect, test, describe } from 'vitest';
import { Semigroup } from '.';

describe('Semigroup Laws', () => {
  test('Associativity law: S(a).concat(S(b).concat(S(c))) ≡ S(a).concat(S(b)).concat(S(c))', () => {
    const stringHello = Semigroup('Hello');
    const stringSpace = Semigroup(' ');
    const stringWorld = Semigroup('world');

    const strAssocOne = stringHello.concat(stringSpace.concat(stringWorld));
    const strAssocTwo = stringHello.concat(stringSpace).concat(stringWorld);

    expect(strAssocOne.name).toEqual(strAssocTwo.name);
    expect(strAssocOne.__value).toEqual(strAssocTwo.__value);
  });
});

describe('Semigroup Inherited (Module)', () => {
  test('Should have correct type', () => {
    const mod = Semigroup('unit test');

    expect(mod.inspect()).toEqual('Semigroup(unit test)');
    expect(mod.name).toEqual('Semigroup');
  });

  test('Should contain value', () => {
    const value = 'Hello, test';
    const mod = Semigroup(value);

    const actual = mod.__value;

    expect(actual).toEqual(value);
  });
});
