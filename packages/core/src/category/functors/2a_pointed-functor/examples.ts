import { I as identity } from '@belsrc/fjp-combinators';
import { PointedFunctor } from '.';

// Pointed Functor Laws
// -------------------

const pointedNumFunc = PointedFunctor.of(21);
console.log('Type:', PointedFunctor.name);

// Identity
// F.of(a).map(x => x) ≡ F.of(a)
const pointedIdFunctor = pointedNumFunc.map(identity);

console.log(
  'Law: Identity ➞',
  pointedNumFunc.name === pointedIdFunctor.name &&
    pointedNumFunc.__value === pointedIdFunctor.__value,
  `(values: ${pointedNumFunc.__value}/${pointedIdFunctor.__value})`
);

// Composition
// F.of(a).map(x => f(g(x))) ≡ F.of(a).map(g).map(f)
const f2 = (x: number) => x + 3;
const g2 = (x: number) => x * 4;

const compP1 = pointedNumFunc.map((x) => f2(g2(x)));
const compP2 = pointedNumFunc.map(g2).map(f2);

console.log(
  'Law: Composition ➞',
  compP1.name === compP2.name && compP1.__value === compP2.__value,
  `(values: ${compP1.__value}/${compP2.__value})`
);

// Pointed Functor Test
// -------------------

const strFunctor = PointedFunctor.of('Foo { word }');

const sumFunctor = pointedNumFunc.map((x) => x + 6);
const productFunctor = pointedNumFunc.map((x) => x * 7);
const replaceFunctor = strFunctor.map((s) => s.replace('{ word }', 'Bar'));

console.log('Test: F1 Value ➞', pointedNumFunc.inspect());
console.log('Test: F2 Value ➞', strFunctor.inspect());
console.log('Test: Sum Map Value ➞', sumFunctor.inspect());
console.log('Test: Product Map Value ➞', productFunctor.inspect());
console.log('Test: String Replace Value ➞', replaceFunctor.inspect());

console.log();
