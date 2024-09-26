## Yes, No, Maybe So: Maybe Monad [WIP]

Simplistic in its execution. Maybe simply checks whether the value in the container is `null` or `undefined` before applying the function to it. This allows you to not have to worry about nullish values when you `map`.

The `orElse` function is akin to an `if...else` statement.

And `map` is like doing `if (val != null) { return f(val); }`

```js
Maybe.of(42).map(degreesToRadian);
// Just(0.7330383)

Maybe.of(null).map(degreesToRadian);
// Nothing
```

This lets us keep `map`ing away without having to check if anything is `null`. Much like a slide, in the case of `Nothing`, it will just slide right down to the bottom.

```js
Maybe.of(42).map(degreesToRadians).map(radiansToDegrees).map(degreesToRadians).map(radiansToDegrees);
// Just(42)

Maybe.of(null).map(degreesToRadians).map(radiansToDegrees).map(degreesToRadians).map(radiansToDegrees);
// Nothing
```

No exception handling needed. This can also stop function chain dead in it's tracks. A built in stop process.

```js
// transaction :: Number -> Number -> Number -> Maybe Number
const transaction = tax => price => payment => {
  const total = price * (1 + tax);
  return Maybe.of(payment >= total ? payment - total : null);
};

// giveChange :: Number -> String
const giveChange = changeAmount => `Thank you. Your change is ${changeAmount}.`;

// withSalesTax :: Number -> Number -> Maybe Number
const withSalesTax = transaction(0.07);

// buyCyberPunk :: Number -> Maybe Number
const buyCyberPunk = withSalesTax(59.99);

// purchase :: Number -> String
const purchase = compose(map(giveChange), buyCyberPunk);

const customerOne = purchase(100);
// Just('Thank you. Your change is 35.81.')

const customerTwo = purchase(50);
// Nothing
```

While the value is warm and safe in its home, at some point it will need to leave the context of the Maybe. Whether that be to print to the screen, save to a database, or any other side-effect.

As it is, we never know if the value that is currently in the `Maybe` is `Just` or a `Nothing`. So we need to get the value out but also, provide a value in the absence of one. This is where `Maybe.orElse` (and the composable helper, `orElse`) come in.

```js
const orElse = val => maybe => maybe.orElse(val);

// purchase :: Number -> String
const purchase = compose(orElse('Sorry. This is not enough.'), map(giveChange), buyCyberPunk);

const customerOne = purchase(100);
// 'Thank you. Your change is 35.81.'

const customerTwo = purchase(50);
// 'Sorry. This is not enough.'
```
