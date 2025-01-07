# Function: equalityFn()

> **equalityFn**\<`T`\>(`a`): (`b`) => (`c`) => `boolean`

Logical `(a(x) === b(x))`

## Type Parameters

• **T**

## Parameters

### a

(`x`) => `unknown`

## Returns

`Function`

### Parameters

#### b

(`x`) => `unknown`

### Returns

`Function`

#### Parameters

##### c

`T`

#### Returns

`boolean`

## Link

https://en.wikipedia.org/wiki/Logical_equality

## Link

https://en.wikipedia.org/wiki/Logical_biconditional

## Example

```ts
equalityFn(s => s.trim())(s => s.trimEnd())('foo bar ');
// true
```
