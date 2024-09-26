import { Monad } from '.';

// Monad Laws
// -------------------

const num = 46;
const numMonad = Monad.of(num);
console.log('Type:', Monad.name);

// Left Identity
// M.of(a).chain(f) ≡ M.of(f(a))
const f = (x: number) => x * 2;
const leftIdLeftSide = numMonad.chain(f);
const leftIdRightSide = Monad.of(f(num));

console.log(
  'Law: Left Identity ➞',
  leftIdLeftSide.name === leftIdRightSide.name &&
    leftIdLeftSide.__value === leftIdRightSide.__value,
  `(values: ${leftIdLeftSide.__value}/${leftIdRightSide.__value})`
);

// Right Identity
// M.of(a).chain(M.of) ≡ M.of(a)
const rightIdLeftSide = numMonad.chain(Monad.of);

console.log(
  'Law: Left Identity ➞',
  rightIdLeftSide.name === numMonad.name &&
    rightIdLeftSide.__value === numMonad.__value,
  `(values: ${rightIdLeftSide.__value}/${numMonad.__value})`
);

// Monad Test
// -------------------

const nestedMonad = Monad.of(Monad.of(Monad.of(67)));
const flattenedMonad = nestedMonad.join();

console.log('Test: Nested Monad Value ➞', nestedMonad.__value);
console.log(
  `      Type of parent: ${nestedMonad.name}`,
  `| Type of __value: ${
    nestedMonad.__value?.name ?? typeof nestedMonad.__value
  }`
);

console.log('Test: Flattened Chain Value ➞', flattenedMonad.__value);
console.log(
  `      Type of parent: ${flattenedMonad.name}`,
  `| Type of __value: ${
    flattenedMonad.__value?.constructor?.name ?? typeof flattenedMonad.__value
  }`
);

const addAndLift = (x: number) => Monad.of(x + 6);
const intChain = Monad.of(46);
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
