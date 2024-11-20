[**@accelint/core**](../README.md) • **Docs**

***

[@accelint/core](../README.md) / Psi

# Function: Psi()

> **Psi**\<`A`, `B`\>(`a`): \<`C`\>(`b`) => (`c`) => (`d`) => `B`

Pass two values through the same function and pass the results to another function of 2-arity

Signature: `Psi :: (a → a → b) → (c → a) → c → c → b`

Lambda: `λabcd.a(bc)(bd)`

## Type Parameters

• **A**

• **B**

## Parameters

• **a**

## Returns

`Function`

### Type Parameters

• **C**

### Parameters

• **b**

### Returns

`Function`

#### Parameters

• **c**: `C`

#### Returns

`Function`

##### Parameters

• **d**: `C`

##### Returns

`B`

## Example

```ts
Psi((x) => (y) => x + y)(x => x + 3)(3)(5)
// 14
```
