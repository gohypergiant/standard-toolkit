import { I as identity } from '@belsrc/fjp-combinators';
import { Functor } from '.';

// Functor Laws
// -------------------

const numFunctor = Functor(42);
console.log('Type:', Functor.name);

// Identity
// F(a).map(x => x) ≡ F(a)
const idFunctor = numFunctor.map(identity);

console.log(
  'Law: Identity ➞',
  numFunctor.name === idFunctor.name &&
    numFunctor.__value === idFunctor.__value,
  `(values: ${numFunctor.__value}/${idFunctor.__value})`
);

// Composition
// F(a).map(x => f(g(x))) ≡ F(a).map(g).map(f)
const f1 = (x: number) => x + 1;
const g1 = (x: number) => x * 2;

const compF1 = numFunctor.map((x) => f1(g1(x)));
const compF2 = numFunctor.map(g1).map(f1);

console.log(
  'Law: Composition ➞',
  compF1.name === compF2.name && compF1.__value === compF2.__value,
  `(values: ${compF1.__value}/${compF2.__value})`
);

// Functor Test
// -------------------

const strFunctor = Functor('Hello, { name }');

const sumFunctor = numFunctor.map((x) => x + 6);
const productFunctor = numFunctor.map((x) => x * 7);
const replaceFunctor = strFunctor.map((s) => s.replace('{ name }', 'World'));

console.log('Test: F1 Value ➞', numFunctor.inspect());
console.log('Test: F2 Value ➞', strFunctor.inspect());
console.log('Test: Sum Map Value ➞', sumFunctor.inspect());
console.log('Test: Product Map Value ➞', productFunctor.inspect());
console.log('Test: String Replace Value ➞', replaceFunctor.inspect());

console.log();
