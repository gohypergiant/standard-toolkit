# Function: xorFn()

> **xorFn**\<`T`\>(`a`): (`b`) => (`c`) => `boolean`

Logical `(a(x) ^ b(x))`

Exclusive (Function Result) Disjunction

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

https://en.wikipedia.org/wiki/Exclusive_or

## Example

```ts
xorFn(s => s.trim())(s => s.trimEnd())('foo bar ');
// false
```
