import { expect, test, describe } from 'vitest';
import { I as identity } from '@belsrc/fjp-combinators';
import { Chain } from '.';

describe('Chain Laws', () => {
  test('Associativity law: M(a).chain(f).chain(g) ≡ M(a).chain(x => M(f(x)).chain(g))', async () => {
    const numChain = Chain(46);
    const f = (x: number) => x - 6;
    const g = (x: number) => x * 2;
    const assocLeftSide = numChain.chain(f).chain(g);
    const assocRightSide = numChain.chain((x) => Chain(f(x)).chain(g));

    expect(assocLeftSide.name).toEqual(assocRightSide.name);
    expect(assocLeftSide.__value).toEqual(assocRightSide.__value);
  });
});

describe('Chain Functionality', () => {
  test('Join should flatten nested functors', async () => {
    const value = 67;
    const mod = Chain(Chain(Chain(value)));
    const flat = mod.join();

    const actual = flat.__value;

    expect(actual).toEqual(value);
    expect(typeof actual).toEqual('number');
  });

  test('Chain should apply function and flatten', async () => {
    const value = 46;
    const addAndLift = (x: number) => Chain(x + 6);
    const intChain = Chain(value);
    const addedChain = intChain.map(addAndLift);
    const chainAddChain = intChain.chain(addAndLift);

    const actual1 = addedChain.__value;
    const actual2 = chainAddChain.__value;

    expect(typeof actual1).toEqual('object');

    expect(actual2).toEqual(value + 6);
    expect(typeof actual2).toEqual('number');
  });
});

describe('Chain Inherited (Module)', () => {
  test('Should have correct type', async () => {
    const mod = Chain('unit test');

    expect(mod.inspect()).toEqual('Chain(unit test)');
    expect(mod.name).toEqual('Chain');
  });

  test('Should contain value', async () => {
    const value = 342;
    const mod = Chain(value);

    const actual = mod.__value;

    expect(actual).toEqual(value);
  });
});

describe('Chain Inherited (Functor)', () => {
  test('Identity law: F(a).map(x => x) ≡ F(a)', async () => {
    const numFunctor = Chain(42);
    const idFunctor = numFunctor.map(identity);

    expect(numFunctor.name).toEqual(idFunctor.name);
    expect(numFunctor.__value).toEqual(idFunctor.__value);
  });

  test('Composition law: F(a).map(x => f(g(x))) ≡ F(a).map(g).map(f)', async () => {
    const numFunctor = Chain(42);
    const f1 = (x: number) => x + 1;
    const g1 = (x: number) => x * 2;

    const compF1 = numFunctor.map((x) => f1(g1(x)));
    const compF2 = numFunctor.map(g1).map(f1);

    expect(compF1.name).toEqual(compF2.name);
    expect(compF1.__value).toEqual(compF2.__value);
  });
});

describe('Chain Inherited (Apply)', () => {
  test('Composition law: A(a).ap(A(g).ap(A(f).map(f => g => x => f(g(x))))) ≡ A(a).ap(A(g)).ap(A(f))', async () => {
    const numApply = Chain(21);
    const applyF = Chain((x: number) => x + 3);
    const applyG = Chain((x: number) => x * 4);
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
