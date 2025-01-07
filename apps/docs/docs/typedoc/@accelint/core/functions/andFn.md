# Function: andFn()

> **andFn**\<`T`, `A`\>(`a`): \<`B`\>(`b`) => (`c`) => `boolean`

Logical `(a(x) && b(x))`

Logical (Function Result) Conjunction

## Type Parameters

• **T**

• **A**

## Parameters

### a

(`x`) => `A`

## Returns

`Function`

### Type Parameters

• **B**

### Parameters

#### b

(`y`) => `B`

### Returns

`Function`

#### Parameters

##### c

`T`

#### Returns

`boolean`

## Link

https://en.wikipedia.org/wiki/Logical_conjunction

## Example

```ts
andFn(s => s.trim())(s => s.trimEnd())('foo bar ');
// true
```
