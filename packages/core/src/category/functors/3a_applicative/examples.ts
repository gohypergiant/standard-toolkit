import { I as identity } from '@belsrc/fjp-combinators';
import { Applicative } from '.';

// Applicative Laws
// -------------------

const val = 42;
const numApplicative = Applicative.of(val);
console.log('Type:', Applicative.name);

// Identity
// A.of(a).ap(A.of(x => x)) ≡ A.of(a)
const idApplicate = Applicative.of(identity);
const idNumApplicative = numApplicative.ap(idApplicate);

// Aa.of(a) = numApplicative | A.of(x => x) = idApplicate

console.log(
  'Law: Identity ➞',
  numApplicative.name === idNumApplicative.name &&
    numApplicative.__value === idNumApplicative.__value,
  `(values: ${numApplicative.__value}/${idNumApplicative.__value})`
);

// Homomorphism
// A.of(a).ap(A.of(f)) ≡ A.of(f(a))
const square = (x: number) => x * 2;
const squareApplicative = Applicative.of(square);
const homomorph1 = numApplicative.ap(squareApplicative);
const homomorph2 = Applicative.of(square(val));

// A.of(a) = numApplicative | A.of(f) = squareApplicative

console.log(
  'Law: Homomorphism ➞',
  homomorph1.name === homomorph2.name &&
    homomorph1.__value === homomorph2.__value,
  `(values: ${homomorph1.__value}/${homomorph2.__value})`
);

// Interchange
// A.of(a).ap(A.of(f)) ≡ A.of(f).ap(A.of(fn => fn(a)))
const interFunc = Applicative.of((fn: (x: number) => number) => fn(val));
const interMulti = Applicative.of((x: number) => x * 5);
const interA1 = numApplicative.ap(interMulti);
const interA2 = interMulti.ap(interFunc);

// Aa.of(a) = numApplicative | A.of(f) = interMulti | A.of(fn...) = interFunc

console.log(
  'Law: Interchange ➞',
  interA1.name === interA2.name && interA1.__value === interA2.__value,
  `(values: ${interA1.__value}/${interA2.__value})`
);

// Composition
// A.of(a).ap(A.of(g).ap(A.of(f).map(f => g => x => f(g(x))))) ≡ A.of(a).ap(A.of(g)).ap(A.of(f))
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

// A.of(a) = numApplicative | A.of(f) = applicativeF | A.of(g) = applicativeG

console.log(
  'Law: Composition ➞',
  compA1.name === compA2.name && compA1.__value === compA2.__value,
  `(values: ${compA1.__value}/${compA2.__value})`
);

// Applicative Test
// -------------------

const multiplyApplicative = Applicative.of((x: number) => x * 7);
const upperApplicative = Applicative.of((s: string) => s.toUpperCase());

const productApplicative = numApplicative.ap(multiplyApplicative);
const upperCaseApplicative =
  Applicative.of('using Applicative').ap(upperApplicative);

console.log('Test: A1 Value ➞', numApplicative.inspect());
console.log('Test: Product Applicative Value ➞', productApplicative.inspect());
console.log('Test: Upper Applicative Value ➞', upperCaseApplicative.inspect());

console.log();
