import { expect, test, describe } from 'vitest';
import { I as identity } from '@belsrc/fjp-combinators';
import { Monad } from '.';

describe('Monad Laws', () => {
  test('Left Identity law: M.of(a).chain(f) ≡ M.of(f(a))', () => {
    const f = (n: number) => n * 2;
    const Mnl = Monad.of(42).chain(f);
    const Mnr = Monad.of(f(42));

    expect(Mnl.name).toEqual(Mnr.name);
    expect(Mnl.__value).toEqual(Mnr.__value);
  });

  test('Right Identity law: M.of(a).chain(M.of) ≡ M.of(a)', () => {
    const Mnl = Monad.of(42).chain(Monad.of);
    const Mnr = Monad.of(42);

    expect(Mnl.name).toEqual(Mnr.name);
    expect(Mnl.__value).toEqual(Mnr.__value);
  });
});

describe('Monad Inherited (Module)', () => {
  test('Should lift value into context', async () => {
    const value = 342;
    const mod = Monad.of(value);

    const actual = mod.__value;

    expect(actual).toEqual(value);
  });

  test('Should have correct type', async () => {
    const mod = Monad.of('unit test');

    expect(mod.inspect()).toEqual('Monad(unit test)');
    expect(mod.name).toEqual('Monad');
  });
});

describe('Monad Inherited (Functor)', () => {
  test('Identity law: F.of(a).map(x => x) ≡ F.of(a)', async () => {
    const pointedNumFunc = Monad.of(21);
    const pointedIdFunctor = pointedNumFunc.map((x) => x);

    expect(pointedNumFunc.name).toEqual(pointedIdFunctor.name);
    expect(pointedNumFunc.__value).toEqual(pointedIdFunctor.__value);
  });

  test('Composition law: F.of(a).map(x => f(g(x))) ≡ F.of(a).map(g).map(f)', async () => {
    const pointedNumFunc = Monad.of(21);
    const f1 = (x: number) => x + 1;
    const g1 = (x: number) => x * 2;

    const compF1 = pointedNumFunc.map((x) => f1(g1(x)));
    const compF2 = pointedNumFunc.map(g1).map(f1);

    expect(compF1.name).toEqual(compF2.name);
    expect(compF1.__value).toEqual(compF2.__value);
  });
});

describe('Monad Inherited (Apply)', () => {
  test('Composition law: A(a).ap(A(g).ap(A(f).map(f => g => x => f(g(x))))) ≡ A(a).ap(A(g)).ap(A(f))', async () => {
    const numApply = Monad(21);
    const mF = Monad((x: number) => x + 3);
    const mG = Monad((x: number) => x * 4);
    const compA1 = numApply.ap(
      mG.ap(mF.map((f) => (g: (n: number) => number) => (x: number) => f(g(x))))
    );
    const compA2 = numApply.ap(mG).ap(mF);

    expect(compA1.name).toEqual(compA2.name);
    expect(compA1.__value).toEqual(compA2.__value);
  });
});

describe('Monad Inherited (Chain)', () => {
  test('Associativity law: M(a).chain(f).chain(g) ≡ M(a).chain(x => M(f(x)).chain(g))', async () => {
    const numChain = Monad(46);
    const f = (x: number) => x - 6;
    const g = (x: number) => x * 2;
    const assocLeftSide = numChain.chain(f).chain(g);
    const assocRightSide = numChain.chain((x) => Monad(f(x)).chain(g));

    expect(assocLeftSide.name).toEqual(assocRightSide.name);
    expect(assocLeftSide.__value).toEqual(assocRightSide.__value);
  });
});

describe('Monad Inherited (Applicative)', () => {
  test('Identity law: A.of(a).ap(A.of(x => x)) ≡ A.of(a)', async () => {
    const val = 42;
    const numApplicative = Monad.of(val);
    const idApplicate = Monad.of(identity);
    const idNumApplicative = numApplicative.ap(idApplicate);

    expect(numApplicative.name).toEqual(idNumApplicative.name);
    expect(numApplicative.__value).toEqual(idNumApplicative.__value);
  });

  test('Homomorphism law: A.of(a).ap(A.of(f)) ≡ A.of(f(a))', async () => {
    const val = 42;
    const numApplicative = Monad.of(val);
    const square = (x: number) => x * 2;
    const squareApplicative = Monad.of(square);
    const homomorph1 = numApplicative.ap(squareApplicative);
    const homomorph2 = Monad.of(square(val));

    expect(homomorph1.name).toEqual(homomorph2.name);
    expect(homomorph1.__value).toEqual(homomorph2.__value);
  });

  test('Interchange law: A.of(a).ap(A.of(f)) ≡ A.of(f).ap(A.of(fn => fn(a)))', async () => {
    const val = 42;
    const numApplicative = Monad.of(val);
    const interFunc = Monad.of((fn: (x: number) => number) => fn(val));
    const interMulti = Monad.of((x: number) => x * 5);
    const interA1 = numApplicative.ap(interMulti);
    const interA2 = interMulti.ap(interFunc);

    expect(interA1.name).toEqual(interA2.name);
    expect(interA1.__value).toEqual(interA2.__value);
  });
});
