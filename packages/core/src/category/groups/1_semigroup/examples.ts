import { Semigroup } from '.';

// Semigroup Laws
// -------------------

const stringHello = Semigroup('Hello');
const stringSpace = Semigroup(' ');
const stringWorld = Semigroup('world');
console.log('Type:', Semigroup.name);

// Associativity
// S(a).concat(S(b).concat(S(c))) ≡ S(a).concat(S(b)).concat(S(c))
const strAssocOne = stringHello.concat(stringSpace.concat(stringWorld));
const strAssocTwo = stringHello.concat(stringSpace).concat(stringWorld);

// S(a) = stringHello | S(b) = stringSpace | S(c) = stringWorld

console.log(
  'Law: Associativity ➞',
  strAssocOne.name === strAssocTwo.name &&
    strAssocOne.__value === strAssocTwo.__value,
  `(values: ${strAssocOne.__value}/${strAssocTwo.__value})`
);

console.log('Test: stringHello Value ➞', stringHello.inspect());
console.log('Test: stringWorld Value ➞', stringWorld.inspect());

console.log();
