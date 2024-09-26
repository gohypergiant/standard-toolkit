import { expect, test, describe } from 'vitest';
import { I as identity } from '@belsrc/fjp-combinators';
import { PointedFunctor } from '.';

describe('Pointed Functor Laws', () => {
  test('Identity law: F.of(a).map(x => x) ≡ F.of(a)', async () => {
    const pointedNumFunc = PointedFunctor.of(21);
    const pointedIdFunctor = pointedNumFunc.map(identity);

    expect(pointedNumFunc.name).toEqual(pointedIdFunctor.name);
    expect(pointedNumFunc.__value).toEqual(pointedIdFunctor.__value);
  });

  test('Composition law: F.of(a).map(x => f(g(x))) ≡ F.of(a).map(g).map(f)', async () => {
    const pointedNumFunc = PointedFunctor.of(21);
    const f1 = (x: number) => x + 1;
    const g1 = (x: number) => x * 2;

    const compF1 = pointedNumFunc.map((x) => f1(g1(x)));
    const compF2 = pointedNumFunc.map(g1).map(f1);

    expect(compF1.name).toEqual(compF2.name);
    expect(compF1.__value).toEqual(compF2.__value);
  });
});

describe('Pointed Functor Inherited (Module)', () => {
  test('Should have correct type', async () => {
    const mod = PointedFunctor.of('unit test');

    expect(mod.inspect()).toEqual('Pointed Functor(unit test)');
    expect(mod.name).toEqual('PointedFunctor');
  });

  test('Should lift value into context', async () => {
    const value = 342;
    const mod = PointedFunctor.of(value);

    const actual = mod.__value;

    expect(actual).toEqual(value);
  });
});
