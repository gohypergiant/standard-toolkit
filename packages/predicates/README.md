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
- **Color Validation**: Validate hex colors, CSS rgb/rgba strings, RGBA tuples, and RGBA objects
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

## Color Validation

Validate color values in multiple formats - hex strings, CSS rgb/rgba strings, RGBA tuples, and RGBA objects:

```typescript
import {
  isHexColor,
  isCssRgbaString,
  isRgba255Tuple,
  isCssRgbaObject,
  isValid255Channel
} from '@accelint/predicates';

// Hex color validation (#RGB, #RGBA, #RRGGBB, #RRGGBBAA, hash optional)
isHexColor('#FF8040');    // true
isHexColor('#F84');       // true (short form)
isHexColor('FF8040');     // true (hash optional)
isHexColor('#FF804080');  // true (with alpha)
isHexColor('#GG8040');    // false (invalid hex chars)

// CSS rgba/rgb string validation (legacy and modern syntax)
isCssRgbaString('rgba(255, 128, 64, 0.5)');  // true (legacy comma syntax)
isCssRgbaString('rgb(255 128 64)');          // true (modern space syntax)
isCssRgbaString('rgb(255 128 64 / 50%)');    // true (modern with alpha)
isCssRgbaString('RGBA(255, 128, 64, 1)');    // true (case insensitive)
isCssRgbaString('rgb(100%, 50%, 25%)');      // true (percentage values)
isCssRgbaString('#FF8040');                  // false (hex, not rgb string)

// RGBA 255 tuple validation (deck.gl format: [r, g, b, a] where all are 0-255)
isRgba255Tuple([255, 128, 64, 255]);  // true
isRgba255Tuple([255, 128, 64, 128]);  // true (alpha 0-255)
isRgba255Tuple([255, 128, 64]);       // false (missing alpha)
isRgba255Tuple([255, 128, 64, 1]);    // true (alpha = 1 is valid)
isRgba255Tuple([256, 128, 64, 255]);  // false (out of range)

// CSS RGBA object validation (React Aria Components format: {r, g, b, a} where a is 0-1)
isCssRgbaObject({ r: 255, g: 128, b: 64, a: 1 });    // true
isCssRgbaObject({ r: 255, g: 128, b: 64, a: 0.5 });  // true
isCssRgbaObject({ r: 255, g: 128, b: 64 });          // false (missing alpha)
isCssRgbaObject([255, 128, 64, 255]);                // false (array, not object)

// Individual color channel validation (0-255)
isValid255Channel(0);      // true
isValid255Channel(128);    // true
isValid255Channel(255);    // true
isValid255Channel(127.5);  // true (decimals allowed)
isValid255Channel(-1);     // false (below 0)
isValid255Channel(256);    // false (above 255)
isValid255Channel(NaN);    // false
```

### Color Format Type Definitions

```typescript
// deck.gl format - all channels 0-255
type Rgba255Tuple = readonly [r: number, g: number, b: number, a: number];

// React Aria Components format - RGB 0-255, alpha 0-1
type CssRgbaObject = {
  readonly r: number; // 0-255
  readonly g: number; // 0-255
  readonly b: number; // 0-255
  readonly a: number; // 0-1
};
```

### Color Validation Use Cases

```typescript
import { isHexColor, isCssRgbaString, isRgba255Tuple } from '@accelint/predicates';

// Validate user color input
function parseColorInput(input: unknown) {
  if (isHexColor(input)) {
    return { format: 'hex', value: input };
  }
  if (isCssRgbaString(input)) {
    return { format: 'css', value: input };
  }
  if (isRgba255Tuple(input)) {
    return { format: 'tuple', value: input };
  }
  throw new Error('Invalid color format');
}

// Filter valid colors from mixed data
const mixedColors = [
  '#FF8040',
  'rgb(255, 128, 64)',
  [255, 128, 64, 255],
  'invalid',
  { r: 255, g: 128, b: 64, a: 1 }
];

const hexColors = mixedColors.filter(isHexColor);
// ['#FF8040']

const cssStrings = mixedColors.filter(isCssRgbaString);
// ['rgb(255, 128, 64)']

const tuples = mixedColors.filter(isRgba255Tuple);
// [[255, 128, 64, 255]]

// Validate deck.gl color props
import type { Layer } from 'deck.gl';

function createLayerWithColor(color: unknown): Layer {
  if (!isRgba255Tuple(color)) {
    throw new Error('deck.gl requires RGBA tuple with all channels 0-255');
  }
  // TypeScript now knows color is Rgba255Tuple
  return new ScatterplotLayer({ getFillColor: color });
}
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
