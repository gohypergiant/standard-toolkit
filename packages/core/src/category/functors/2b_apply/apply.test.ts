import { expect, test, describe } from 'vitest';
import { I as identity } from '@belsrc/fjp-combinators';
import { Apply } from '.';

describe('Apply Laws', () => {
  test('Composition law: A(a).ap(A(g).ap(A(f).map(f => g => x => f(g(x))))) ≡ A(a).ap(A(g)).ap(A(f))', async () => {
    const numApply = Apply(21);
    const applyF = Apply((x: number) => x + 3);
    const applyG = Apply((x: number) => x * 4);
    const compA1 = numApply.ap(
      applyG.ap(
        applyF.map((f) => (g: (n: number) => number) => (x: number) => f(g(x)))
      )
    );
    const compA2 = numApply.ap(applyG).ap(applyF);

    expect(compA1.name).toEqual(compA2.name);
    expect(compA1.__value).toEqual(compA2.__value);
  });
});

describe('Apply Inherited (Module)', () => {
  test('Should have correct type', async () => {
    const mod = Apply('unit test');

    expect(mod.inspect()).toEqual('Apply(unit test)');
    expect(mod.name).toEqual('Apply');
  });

  test('Should contain value', async () => {
    const value = 342;
    const mod = Apply(value);

    const actual = mod.__value;

    expect(actual).toEqual(value);
  });
});

describe('Apply Inherited (Functor)', () => {
  test('Identity law: F(a).map(x => x) ≡ F(a)', async () => {
    const numFunctor = Apply(42);
    const idFunctor = numFunctor.map(identity);

    expect(numFunctor.name).toEqual(idFunctor.name);
    expect(numFunctor.__value).toEqual(idFunctor.__value);
  });

  test('Composition law: F(a).map(x => f(g(x))) ≡ F(a).map(g).map(f)', async () => {
    const numFunctor = Apply(42);
    const f1 = (x: number) => x + 1;
    const g1 = (x: number) => x * 2;

    const compF1 = numFunctor.map((x) => f1(g1(x)));
    const compF2 = numFunctor.map(g1).map(f1);

    expect(compF1.name).toEqual(compF2.name);
    expect(compF1.__value).toEqual(compF2.__value);
  });
});
