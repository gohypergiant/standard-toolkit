## Nesting Functions: Composition and Compose

Function composition is a technique where you combine two or more functions to create a new function. It involves applying one function to the result of another function. The result of the first function becomes the input for the next function, and so on.

Let's say you have two functions: $f(x)$ and $g(x)$. Function composition, denoted as $(f ∘ g)(x)$, means you apply $g$ to $x$ first, and then you apply $f$ to the result. In other words, $(f ∘ g)(x) = f(g(x))$.

```js
const addFive = x => x + 5;
const double = x => x * 2;
const twenty = double(addFive(5));
```

This works alright for simple things but can get confusing when you need to do several tasks in this fashion.

```js
some(long(funcs(list(val))));
```

The `compose` function is a higher-order function that facilitates function composition. It takes `n` number of functions you want to compose as arguments and returns a new function that performs the composition, in a right-to-left order. The output of the rightmost function is used as the input to the function to its left, and this process continues until all functions have been applied. Compose is also associative. `compose(f, compose(g, h)) === compose(compose(f, g), h)`.


```js
const compose = (...fns) => x => fns.reduceRight((y, f) => f(y), x);

const addOne = (x) => x + 1;

const double = (x) => x * 2;

const addOneAndDouble = compose(double, addOne);

console.log(addOneAndDouble(3)); // Output: 8
```

This also highlights another aspect of functional programming, __point-free style__. Point-free style, also known as tacit programming, "is a programming paradigm in which function definitions do not identify the arguments (or "points") on which they operate." <sup>[(*)](https://en.wikipedia.org/wiki/Tacit_programming)</sup> Point-free is largely used during function composition but can also be used with a variety of HOFs.

```js
const double = val => val * 2;
const ints = [5, 10, 15, 20];
const doubles = ints.map(double);
```

The restrictive part of function composition is that each function needs to be unary since it only receives the return of the previous function. When combining currying and composition together, it allows for more complex compositions.

```js
// utils.js
export const sort = fn => arr => [...arr].sort(fn);
export const filter = fn => arr => arr.filter(fn);
export const page = perPage => page => arr => arr.slice((page - 1) * perPage, perPage * page);
```

```js
import { sort, filter, page } from utils.js
const PER_PAGE = 100;
const currentPage = 1;
const displayPage = page(PER_PAGE);
const sortUserNames = sort((a, b) => a.name > b.name ? 1 : a.name < b.name ? -1 : 0);
const filterActive = filter(x => x.isActive);
const getActiveUsersByPage = page => compose(
  displayPage(page),
  sortUserNames,
  filterActive
);
const activeUsers = getActiveUsersByPage(currentPage)(users);
```
