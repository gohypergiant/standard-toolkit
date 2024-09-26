import { expect, test, describe } from 'vitest';
import { Monoid, IDENTITY_MONOIDS } from '.';

describe('Monoid Laws', () => {
  test('Left identity law: M(a).concat(M.empty()) ≡ M(a) - own.empty', () => {
    const stringHello = Monoid('Hello');

    const lId = stringHello.concat(stringHello.empty());

    expect(lId.name).toEqual(stringHello.name);
    expect(lId.__value).toEqual(stringHello.__value);
  });

  test('Left identity law: M(a).concat(M.empty()) ≡ M(a) - const.empty', () => {
    const stringHello = Monoid('Hello');

    const lId = stringHello.concat(IDENTITY_MONOIDS.String);

    expect(lId.name).toEqual(stringHello.name);
    expect(lId.__value).toEqual(stringHello.__value);
  });

  // M.empty().concat(M(a)) ≡ M(a)
  test('Right identity law: M.empty().concat(M(a)) ≡ M(a) - own.empty', () => {
    const stringHello = Monoid('Hello');

    const rId = stringHello.empty().concat(stringHello);
    // Read TODO in code file about lack of static empty

    expect(rId.name).toEqual(stringHello.name);
    expect(rId.__value).toEqual(stringHello.__value);
  });

  test('Right identity law: M.empty().concat(M(a)) ≡ M(a) - const.empty', () => {
    const stringHello = Monoid('Hello');

    const rId = IDENTITY_MONOIDS.String.concat(stringHello);

    expect(rId.name).toEqual(stringHello.name);
    expect(rId.__value).toEqual(stringHello.__value);
  });
});

describe('Monoid Inherited (Module)', () => {
  test('Should have correct type', () => {
    const mod = Monoid('unit test');

    expect(mod.inspect()).toEqual('Monoid(unit test)');
    expect(mod.name).toEqual('Monoid');
  });

  test('Should contain value', () => {
    const value = 'Hello, test';
    const mod = Monoid(value);

    const actual = mod.__value;

    expect(actual).toEqual(value);
  });
});

describe('Monoid Inherited (Semigroup)', () => {
  test('Associativity law: S(a).concat(S(b).concat(S(c))) ≡ S(a).concat(S(b)).concat(S(c))', () => {
    const stringHello = Monoid('Hello');
    const stringSpace = Monoid(' ');
    const stringWorld = Monoid('world');

    const strAssocOne = stringHello.concat(stringSpace).concat(stringWorld);
    const strAssocTwo = stringHello.concat(stringSpace.concat(stringWorld));

    expect(strAssocOne.name).toEqual(strAssocTwo.name);
    expect(strAssocOne.__value).toEqual(strAssocTwo.__value);
  });
});
