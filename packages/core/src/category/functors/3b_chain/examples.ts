import { Chain } from '.';

// Chain Laws
// -------------------

const numChain = Chain(46);
console.log('Type:', Chain.name);

// Associativity
// M(a).chain(f).chain(g) ≡ M(a).chain(x => M(f(x)).chain(g))
const f = (x: number) => x - 6;
const g = (x: number) => x * 2;
const assocLeftSide = numChain.chain(f).chain(g);
const assocRightSide = numChain.chain((x) => Chain(f(x)).chain(g));

console.log(
  'Law: Associativity ➞',
  assocLeftSide.name === assocRightSide.name &&
    assocLeftSide.__value === assocRightSide.__value,
  `(values: ${assocLeftSide.__value}/${assocRightSide.__value})`
);

// Chain Test
// -------------------

const nestedChain = Chain(Chain(Chain(67)));
const flattenedChain = nestedChain.join();

console.log('Test: Nested Chain Value ➞', nestedChain.__value);
console.log(
  `      Type of parent: ${nestedChain.name}`,
  `| Type of __value: ${
    nestedChain.__value?.name ?? typeof nestedChain.__value
  }`
);

console.log('Test: Flattened Chain Value ➞', flattenedChain.__value);
console.log(
  `      Type of parent: ${flattenedChain.name}`,
  `| Type of __value: ${
    flattenedChain.__value?.constructor?.name ?? typeof flattenedChain.__value
  }`
);

const addAndLift = (x: number) => Chain(x + 6);
const intChain = Chain(46);
const addedChain = intChain.map(addAndLift);
const chainAddChain = intChain.chain(addAndLift);

console.log('Test: Add & Lift Value ➞', addedChain.__value);
console.log(
  `      Type of parent: ${addedChain.name}`,
  `| Type of __value: ${addedChain.__value?.name ?? typeof addedChain.__value}`
);

console.log('Test: Chain Add & Lift Value ➞', chainAddChain.__value);
console.log(
  `      Type of parent: ${chainAddChain.name}`,
  `| Type of __value: ${
    chainAddChain.__value?.constructor?.name ?? typeof chainAddChain.__value
  }`
);

console.log();
