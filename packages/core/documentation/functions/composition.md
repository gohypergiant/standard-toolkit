[**@accelint/core**](../README.md) • **Docs**

***

[@accelint/core](../README.md) / composition

# Function: composition()

> **composition**\<`A`, `B`\>(`f`): \<`C`\>(`g`) => (`x`) => `B`

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

## Alias

B

## Example

```ts
B((x) => x + 8)((x) => x * 3)(4);
// 20
```
