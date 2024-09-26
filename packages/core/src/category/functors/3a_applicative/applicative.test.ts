import { expect, test, describe } from 'vitest';
import { I as identity } from '@belsrc/fjp-combinators';
import { Applicative } from '.';

describe('Applicative Laws', () => {
  test('Identity law: A.of(a).ap(A.of(x => x)) ≡ A.of(a)', async () => {
    const val = 42;
    const numApplicative = Applicative.of(val);
    const idApplicate = Applicative.of(identity);
    const idNumApplicative = numApplicative.ap(idApplicate);

    expect(numApplicative.name).toEqual(idNumApplicative.name);
    expect(numApplicative.__value).toEqual(idNumApplicative.__value);
  });

  test('Homomorphism law: A.of(a).ap(A.of(f)) ≡ A.of(f(a))', async () => {
    const val = 42;
    const numApplicative = Applicative.of(val);
    const square = (x: number) => x * 2;
    const squareApplicative = Applicative.of(square);
    const homomorph1 = numApplicative.ap(squareApplicative);
    const homomorph2 = Applicative.of(square(val));

    expect(homomorph1.name).toEqual(homomorph2.name);
    expect(homomorph1.__value).toEqual(homomorph2.__value);
  });

  test('Interchange law: A.of(a).ap(A.of(f)) ≡ A.of(f).ap(A.of(fn => fn(a)))', async () => {
    const val = 42;
    const numApplicative = Applicative.of(val);
    const interFunc = Applicative.of((fn: (x: number) => number) => fn(val));
    const interMulti = Applicative.of((x: number) => x * 5);
    const interA1 = numApplicative.ap(interMulti);
    const interA2 = interMulti.ap(interFunc);

    expect(interA1.name).toEqual(interA2.name);
    expect(interA1.__value).toEqual(interA2.__value);
  });

  test('Composition law: A.of(a).ap(A.of(g).ap(A.of(f).map(f => g => x => f(g(x))))) ≡ A.of(a).ap(A.of(g)).ap(A.of(f))', async () => {
    const val = 42;
    const numApplicative = Applicative.of(val);
    const applicativeF = Applicative.of((x: number) => x + 3);
    const applicativeG = Applicative.of((x: number) => x * 4);
    const compA1 = numApplicative.ap(
      applicativeG.ap(
        applicativeF.map(
          (f) => (g: (n: number) => number) => (x: number) => f(g(x))
        )
      )
    );
    const compA2 = numApplicative.ap(applicativeG).ap(applicativeF);

    expect(compA1.name).toEqual(compA2.name);
    expect(compA1.__value).toEqual(compA2.__value);
  });
});

describe('Applicative Inherited (Module)', () => {
  test('Should lift value into context', async () => {
    const value = 342;
    const mod = Applicative.of(value);

    const actual = mod.__value;

    expect(actual).toEqual(value);
  });

  test('Should have correct type', async () => {
    const mod = Applicative.of('unit test');

    expect(mod.inspect()).toEqual('Applicative(unit test)');
    expect(mod.name).toEqual('Applicative');
  });
});

describe('Applicative Inherited (Functor)', () => {
  test('Identity law: F.of(a).map(x => x) ≡ F.of(a)', async () => {
    const pointedNumFunc = Applicative.of(21);
    const pointedIdFunctor = pointedNumFunc.map((x) => x);

    expect(pointedNumFunc.name).toEqual(pointedIdFunctor.name);
    expect(pointedNumFunc.__value).toEqual(pointedIdFunctor.__value);
  });

  test('Composition law: F.of(a).map(x => f(g(x))) ≡ F.of(a).map(g).map(f)', async () => {
    const pointedNumFunc = Applicative.of(21);
    const f1 = (x: number) => x + 1;
    const g1 = (x: number) => x * 2;

    const compF1 = pointedNumFunc.map((x) => f1(g1(x)));
    const compF2 = pointedNumFunc.map(g1).map(f1);

    expect(compF1.name).toEqual(compF2.name);
    expect(compF1.__value).toEqual(compF2.__value);
  });
});
