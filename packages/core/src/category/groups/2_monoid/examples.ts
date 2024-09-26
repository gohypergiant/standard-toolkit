import { Monoid, IDENTITY_MONOIDS } from '.';

// Monoid Laws
// -------------------

const stringHello = Monoid('Hello');
console.log('Type:', Monoid.name);

// Left identity
// M(a).concat(M.empty()) ≡ M(a)
const lId1 = stringHello.concat(stringHello.empty());

console.log(
  'Law: Left identity (own.empty) ➞',
  lId1.name === stringHello.name && lId1.__value === stringHello.__value,
  `(values: ${lId1.__value}/${stringHello.__value})`
);

const lId2 = stringHello.concat(IDENTITY_MONOIDS.String);

console.log(
  'Law: Left identity (const.empty) ➞',
  lId2.name === stringHello.name && lId2.__value === stringHello.__value,
  `(values: ${lId2.__value}/${stringHello.__value})`
);

// Right identity
// M.empty().concat(M(a)) ≡ M(a)
const rId1 = stringHello.empty().concat(stringHello);

// Read TODO in code file about lack of static empty

console.log(
  'Law: Right identity (own.empty) ➞',
  rId1.name === stringHello.name && rId1.__value === stringHello.__value,
  `(values: ${rId1.__value}/${stringHello.__value})`
);

const rId2 = IDENTITY_MONOIDS.String.concat(stringHello);

console.log(
  'Law: Right identity (const.empty) ➞',
  rId2.name === stringHello.name && rId2.__value === stringHello.__value,
  `(values: ${rId2.__value}/${stringHello.__value})`
);

console.log();
