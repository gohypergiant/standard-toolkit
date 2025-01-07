# Function: A()

> **A**\<`T`, `R`\>(`f`): (`x`) => `R`

Takes an unary function and applies it to the given argument.

Signature: `A :: (a → b) → a → b`

Lambda: `λab.ab`

## Type Parameters

• **T**

• **R**

## Parameters

### f

(`x`) => `R`

## Returns

`Function`

### Parameters

#### x

`T`

### Returns

`R`

## Example

```ts
A((a) => a + 6)(3);
// 9
```
