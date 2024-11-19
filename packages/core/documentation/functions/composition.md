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

## Defined in

[combinators/b/index.ts:23](https://github.com/gohypergiant/standard-toolkit/blob/87ae5060c82d212b75a10cafb0030b08916e90f1/packages/core/src/combinators/b/index.ts#L23)
