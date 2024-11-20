[**@accelint/core**](../README.md) • **Docs**

***

[@accelint/core](../README.md) / B

# Function: B()

> **B**\<`A`, `B`\>(`f`): \<`C`\>(`g`) => (`x`) => `B`

Pass a value to a function and then the result to another function.

Bird: `Bluebird`

Signature: `B :: (a → b) → (c → a) → c → b`

Lambda: `λabc.a(bc)`

## Type Parameters

• **A**

• **B**

## Parameters

• **f**

## Returns

`Function`

### Type Parameters

• **C**

### Parameters

• **g**

### Returns

`Function`

#### Parameters

• **x**: `C`

#### Returns

`B`

## Example

```ts
B((x) => x + 8)((x) => x * 3)(4);
// 20
```
