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

[combinators/b/index.ts:23](https://github.com/gohypergiant/standard-toolkit/blob/258694cea8ed8bbd956b3cf5da47c2c9debcf127/packages/core/src/combinators/b/index.ts#L23)
