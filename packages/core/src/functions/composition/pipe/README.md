## Reversed Compose: Pipe

Pipe is functionally the same as `compose`. The only difference is where `compose` is right-to-left, `pipe` is left-to-right. This makes it easier for some to reason about the flow.

```js
const pipe = (g, f) => (x) => f(g(x));

const addOne = (x) => x + 1;

const double = (x) => x * 2;

const addOneAndDouble = pipe(double, addOne);

console.log(addOneAndDouble(3)); // Output: 7
```
