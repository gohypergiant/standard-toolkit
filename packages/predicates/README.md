# @accelint/predicates

A collection of useful predicate functions for JavaScript. Easily check data types, compare values, and validate conditions with simple, reusable functions.

## Installation

```sh
npm install @accelint/predicates
```

## Features

- **Type Checking**: Validate data types (string, number, Worker, SharedWorker)
- **Value Comparison**: Test values against thresholds (greater, lesser, equal, between)
- **String Matching**: Check string patterns and affixes (starts/ends with, regex matching)
- **Array Membership**: Test value presence in arrays
- **Boolean Evaluation**: Advanced true/false/yes/no/on/off checking
- **Geospatial Validation**: Validate latitude, longitude, and bounding boxes
- **Null Checking**: Test for null/undefined values
- **Functional API**: Curried predicates perfect for array methods and composition
- **Tree-Shakeable**: Import only what you need for optimal bundle size

## Type Predicates

### Type Checking

Check if values match specific JavaScript types:

```typescript
import { isString } from '@accelint/predicates/is-string';
import { isNumber, isFiniteNumber, isNumeric, isFiniteNumeric } from '@accelint/predicates/is-number';
import { isWorker, isSharedWorker } from '@accelint/predicates/is-worker';

// String checking
isString('hello');          // true
isString(123);              // false

// Number checking
isNumber(42);               // true
isNumber(Infinity);         // true
isNumber(NaN);              // true
isNumber('42');             // false

isFiniteNumber(42);         // true
isFiniteNumber(Infinity);   // false

isNumeric('42');            // true (parses as number)
isFiniteNumeric('42');      // true

// Worker checking
const worker = new Worker(new URL('./worker.ts', import.meta.url));
isWorker(worker);           // true

const sharedWorker = new SharedWorker(new URL('./shared.ts', import.meta.url));
isSharedWorker(sharedWorker); // true
```

### Null/Undefined Checking

Test for null or undefined values:

```typescript
import { isNothing, isSomething } from '@accelint/predicates';

isNothing(null);        // true
isNothing(undefined);   // true
isNothing(0);           // false

isSomething(0);         // true
isSomething('');        // true
isSomething(null);      // false
```

## Comparison Predicates

### Numeric and String Comparison

Create predicates that test values against thresholds:

```typescript
import { isEqual, isGreater, isLesser, isGreaterEqual, isLesserEqual } from '@accelint/predicates';

const isZero = isEqual(0);
isZero(0);   // true
isZero('0'); // false (strict equality)

const isAdult = isGreaterEqual(18);
isAdult(21); // true
isAdult(18); // true (inclusive)
isAdult(16); // false

const isBelowLimit = isLesser(100);
isBelowLimit(50);  // true
isBelowLimit(150); // false

// Works with strings (lexicographic comparison)
const isAfterM = isGreater('M');
isAfterM('Z'); // true
isAfterM('A'); // false

// Useful with arrays
const numbers = [1, 5, 10, 15, 20];
numbers.filter(isGreater(10)); // [15, 20]
```

### Range Checking

Test if values fall within a range:

```typescript
import { isBetween, isNotBetween } from '@accelint/predicates';

const isValidScore = isBetween([0, 100]);
isValidScore(89);  // true
isValidScore(150); // false
isValidScore(0);   // true (inclusive)

// Order doesn't matter
const isInRange = isBetween([100, 0]);
isInRange(50); // true

const isOutlier = isNotBetween([0, 100]);
isOutlier(105); // true
isOutlier(50);  // false
```

## String Predicates

### Prefix and Suffix Matching

Check if strings start or end with specific substrings:

```typescript
import { doesStartWith, doesNotStartWith, doesEndWith, doesNotEndWith } from '@accelint/predicates';

const startsWithHttp = doesStartWith('http');
startsWithHttp('https://example.com'); // true
startsWithHttp('ftp://example.com');   // false

const isJsFile = doesEndWith('.js');
isJsFile('app.js');   // true
isJsFile('style.css'); // false

// Useful with arrays
const urls = ['https://a.com', 'http://b.com', 'ftp://c.com'];
urls.filter(doesStartWith('http')); // ['https://a.com', 'http://b.com']

const files = ['app.js', 'style.css', 'main.ts'];
files.filter(doesEndWith('.js')); // ['app.js']
```

### Pattern Matching

Match strings against regular expressions:

```typescript
import { isLike, isNotLike } from '@accelint/predicates';

const isJsFile = isLike(/\.(js|ts)$/);
isJsFile('app.js');   // true
isJsFile('style.css'); // false

const hasNumbers = isLike('[0-9]');
hasNumbers('abc123'); // true
hasNumbers('abcdef'); // false

const isEmail = isLike(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
isEmail('user@example.com'); // true
isEmail('invalid-email');    // false

// Useful with arrays
const files = ['app.js', 'style.css', 'main.ts', 'README.md'];
files.filter(isLike(/\.(js|ts)$/)); // ['app.js', 'main.ts']
```

## Array Membership

Test if values exist in arrays:

```typescript
import { isIn, isNotIn } from '@accelint/predicates';

const isValidStatus = isIn(['pending', 'approved', 'rejected']);
isValidStatus('pending');  // true
isValidStatus('unknown');  // false

const isPrime = isIn([2, 3, 5, 7, 11, 13]);
isPrime(7);  // true
isPrime(10); // false

// Useful for filtering
const allowedIds = [101, 102, 103];
const allRequests = [101, 104, 102, 105];
const authorized = allRequests.filter(isIn(allowedIds)); // [101, 102]
const unauthorized = allRequests.filter(isNotIn(allowedIds)); // [104, 105]
```

## Boolean Evaluation

Advanced boolean-like value checking:

```typescript
import {
  isTrue, isFalse,
  isYes, isNo,
  isOn, isOff,
  isAnyTruthy, isAnyFalsy
} from '@accelint/predicates/is-noyes';

// True values: ['1', 'true']
isTrue(1);         // true
isTrue(true);      // true
isTrue('TRUE');    // true (case-insensitive)

// False values: ['', '0', 'false', 'nan', 'null', 'undefined']
isFalse('');       // true
isFalse(0);        // true
isFalse('FALSE');  // true

// Yes values: ['1', 'true', 'y', 'yes']
isYes('yes');      // true
isYes('Y');        // true

// No values: ['', '0', 'false', 'nan', 'null', 'undefined', 'n', 'no']
isNo('no');        // true
isNo('N');         // true

// On values: ['1', 'true', 'on']
isOn('on');        // true
isOn(1);           // true

// Off values: ['', '0', 'false', 'nan', 'null', 'undefined', 'off']
isOff('off');      // true
isOff(0);          // true

// Combined checks
isAnyTruthy('yes');  // true
isAnyTruthy('on');   // true
isAnyTruthy(1);      // true

isAnyFalsy('no');    // true
isAnyFalsy('off');   // true
isAnyFalsy(0);       // true
```

## Geospatial Predicates

Validate geographic coordinates and bounding boxes:

```typescript
import { isLatitude, isLongitude, isBbox } from '@accelint/predicates';

// Latitude validation (-90 to 90)
isLatitude(-90);  // true
isLatitude(0);    // true
isLatitude(90);   // true
isLatitude(-100); // false

// Longitude validation (-180 to 180)
isLongitude(-180); // true
isLongitude(0);    // true
isLongitude(180);  // true
isLongitude(-190); // false

// Bounding box validation (array of 4 finite numbers)
isBbox([-180, -90, 180, 90]);   // true
isBbox([-122.5, 37.7, -122.4, 37.8]); // true
isBbox([1, 2, 3]);              // false (wrong length)
isBbox([1, 2, NaN, 4]);         // false (NaN not allowed)
```

## Functional Composition

All predicates are curried and work great with functional programming:

```typescript
import { isGreater, isLesser, doesStartWith, isIn } from '@accelint/predicates';

const users = [
  { name: 'Alice', age: 25, status: 'active' },
  { name: 'Bob', age: 17, status: 'inactive' },
  { name: 'Charlie', age: 30, status: 'active' },
];

// Filter adults
const adults = users.filter(user => isGreaterEqual(18)(user.age));

// Find users with names starting with 'A'
const aNames = users.filter(user => doesStartWith('A')(user.name));

// Filter by valid status
const validStatuses = ['active', 'pending'];
const activeUsers = users.filter(user => isIn(validStatuses)(user.status));
```

## Use Cases

### Form Validation

```typescript
import { isString, isFiniteNumeric, isIn, isLike } from '@accelint/predicates';

const isValidAge = (age: unknown) =>
  isFiniteNumeric(age) && isBetween([0, 150])(Number(age));

const isValidEmail = isLike(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);

const isValidCountry = isIn(['US', 'CA', 'UK', 'AU']);

function validateForm(data: Record<string, unknown>) {
  return {
    name: isString(data.name),
    age: isValidAge(data.age),
    email: isValidEmail(data.email as string),
    country: isValidCountry(data.country)
  };
}
```

### Data Filtering

```typescript
import { isGreaterEqual, doesEndWith, isNothing } from '@accelint/predicates';

const products = [
  { name: 'Widget', price: 10, stock: 5 },
  { name: 'Gadget', price: 25, stock: 0 },
  { name: 'Doohickey', price: 15, stock: null },
];

// Find products with stock
const inStock = products.filter(p => isSomething(p.stock) && isGreater(0)(p.stock));

// Find affordable products
const affordable = products.filter(p => isLesserEqual(20)(p.price));

// Find premium products in stock
const premium = products
  .filter(p => isGreaterEqual(20)(p.price))
  .filter(p => isGreater(0)(p.stock));
```

### Configuration Parsing

```typescript
import { isTrue, isAnyTruthy } from '@accelint/predicates/is-noyes';

function parseConfig(config: Record<string, unknown>) {
  return {
    debug: isAnyTruthy(config.DEBUG),
    verbose: isTrue(config.VERBOSE),
    port: isFiniteNumeric(config.PORT) ? Number(config.PORT) : 3000,
  };
}

parseConfig({ DEBUG: 'yes', VERBOSE: '1', PORT: '8080' });
// { debug: true, verbose: true, port: 8080 }
```

## TypeScript Support

All functions are fully typed and written in TypeScript. Type definitions are included in the package, providing excellent IDE autocomplete and type safety.

## Tree-Shaking

Each predicate can be imported individually for optimal bundle size:

```typescript
// Import specific predicates
import { isString } from '@accelint/predicates/is-string';
import { isGreater } from '@accelint/predicates/is-greater';
import { isBetween } from '@accelint/predicates/is-between';

// Or import from the main entry
import { isString, isGreater, isBetween } from '@accelint/predicates';
```

## License

Apache-2.0
