import { Apply } from '.';

// Apply Laws
// -------------------

const numApply = Apply(21);
console.log('Type:', Apply.name);

// Composition
// A(a).ap(A(g).ap(A(f).map(f => g => x => f(g(x))))) ≡ A(a).ap(A(g)).ap(A(f))
const applyF = Apply((x: number) => x + 3);
const applyG = Apply((x: number) => x * 4);

// A(v) = numApply | A(f) = applyF | A(g) = applyG

const compA1 = numApply.ap(
  applyG.ap(
    applyF.map(
      (f: (n: number) => number) => (g: (n: number) => number) => (x: number) =>
        f(g(x))
    )
  )
);
const compA2 = numApply.ap(applyG).ap(applyF);

console.log(
  'Law: Composition ➞',
  compA1.name === compA2.name && compA1.__value === compA2.__value,
  `(values: ${compA1.__value}/${compA2.__value})`
);

// Apply Test
// -------------------

const multiplyAp = Apply((x: number) => x * 4);
const upperAp = Apply((s: string) => s.toUpperCase());

const productApply = numApply.ap(multiplyAp);
const upperCaseApply = Apply('test uppercase').ap(upperAp);

console.log('Test: A1 Value ➞', numApply.inspect());
console.log('Test: Product Apply Value ➞', productApply.inspect());
console.log('Test: Upper Apply Value ➞', upperCaseApply.inspect());

console.log();
