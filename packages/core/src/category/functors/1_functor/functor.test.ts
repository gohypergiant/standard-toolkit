import { expect, test, describe } from 'vitest';
import { I as identity } from '@belsrc/fjp-combinators';
import { Functor } from '.';

describe('Functor Laws', () => {
  test('Identity law: F(a).map(x => x) ≡ F(a)', async () => {
    const numFunctor = Functor(42);
    const idFunctor = numFunctor.map(identity);

    expect(numFunctor.name).toEqual(idFunctor.name);
    expect(numFunctor.__value).toEqual(idFunctor.__value);
  });

  test('Composition law: F(a).map(x => f(g(x))) ≡ F(a).map(g).map(f)', async () => {
    const numFunctor = Functor(42);
    const f1 = (x: number) => x + 1;
    const g1 = (x: number) => x * 2;

    const compF1 = numFunctor.map((x) => f1(g1(x)));
    const compF2 = numFunctor.map(g1).map(f1);

    expect(compF1.name).toEqual(compF2.name);
    expect(compF1.__value).toEqual(compF2.__value);
  });
});

describe('Functor Inherited (Module)', () => {
  test('Should have correct type', async () => {
    const mod = Functor('unit test');

    expect(mod.inspect()).toEqual('Functor(unit test)');
    expect(mod.name).toEqual('Functor');
  });

  test('Should contain value', async () => {
    const value = 342;
    const mod = Functor(value);

    const actual = mod.__value;

    expect(actual).toEqual(value);
  });
});
