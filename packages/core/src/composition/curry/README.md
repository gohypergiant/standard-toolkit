## Piecemeal Functions: Currying

Currying is a technique where a function that takes multiple arguments (_n_-ary) is transformed into a series of functions, each taking one argument (unary). $f(n\textrm{ arity})→f(n-1\textrm{ arity})→\text{etc}$ . Arity (/ˈæɹɪti/) is just a fancy (pinkies out) way of referring to the number of arguments that a function takes. `nullary` (0), `unary` (1), `binary` (2), `ternary` (3), `n-ary` (n) are all terms that are commonly used to describe functions solely on their number of arguments.

In a curried function, each function call returns another function that expects the next argument until all arguments are provided, and then the final result is returned. Currying a function is just taking it and converting it to a series of closures. It makes the function more modular and flexible by allowing you to partially apply arguments, creating new functions with fewer parameters.

```js
const multiply = x => y => x * y;
const double = multiply(2);
const triple = multiply(3);

console.log(double(4));  // Output: 8
console.log(triple(5));  // Output: 15
```

or

```js
const transaction = tax => price => payment => payment - price * (1 + tax);
const withSalesTax = transaction(0.07);
const buySmashBros = withSalesTax(43.95);
const buyWitcherThree = withSalesTax(38.30);
const customerOneChange = buySmashBros(60);   // → 12.97
const customerTwoChange = buyWitcherThree(50); // → 9.02
const customerThreeChange = buySmashBros(100); // → 52.97
```

Magic numbers notwithstanding, the above illustrates how currying allows you to define some constant part of the application once and then reuse it without having to continually repeat it. Which has the added benefit of reducing boilerplate and redundancies throughout the codebase.

In the strictest definition, currying will always be a unary function that returns another unary function (until all arguments are given). There's another term, which is similar to curry, called partial application (or autocurry). The way that partial application differs is that with a partial application you supply one, __or more__, arguments at a time and get back a partially applied function that waits for the remaining arguments.

This is the method that I usually prefer since sometimes you have access to more than just one of the arguments at a time. Partial application usually requires some sort of wrapper function to allow for the one or more argument application.

```js
function partial(fn, arity = fn.length, ...args) {
  return arity <= args.length ?
    fn(...args) :
    partial.bind(null, fn, arity, ...args);
}
const transaction = partial((tax, price, payment) => payment - price * (1 + tax));
const buySmashBros = transaction(0.07, 43.95);
const buyWitcherThree = transaction(0.07, 38.30);
const customerOneChange = buySmashBros(60);   // → 12.97
const customerTwoChang = buyWitcherThree(50); // → 9.02
const customerThreeChang = buySmashBros(100); // → 52.97
```

Partial application is usually a lot more flexible to use as well.

```js
transaction(0.07, 43.95, 60); // → 12.97
transaction(0.07)(43.95, 60); // → 12.97
transaction(0.07, 43.95)(60); // → 12.97
transaction(0.07)(43.95)(60); // → 12.97
```

You may have noticed in the examples above that the "main" piece of data that is being acted upon is the last arguement. This is a convention know as "data last." This just means that we want put all of our "boilerplate" arguments first and lastly the data. This makes it so that we can do all of the basic partial application as soon as possible and then just keep reusing that final function. Having the data last in curried functions also lets us use them as one off functions or easily plug them into things like array methods.

```js
const transactionTotal = tax => price => price * (1 + tax);
const withSalesTax = transaction(0.07);

// Single purchase
const coffeeTotal = withSalesTax(4.95);

// Multiple
const itemsSold = [
  4.95,
  5.95,
  10.99,
  1.50,
  // ...
];

const dailyTotal = itemsSold.reduce((total, item) => total + withSalesTax(item), 0);
```

This is a change from the defacto "data first" which is usually taught in schools (explicitly or not) and is common in OOP languages.
