[**@accelint/core**](../README.md) • **Docs**

***

[@accelint/core](../README.md) / lookup

# Function: lookup()

> **lookup**\<`A`, `B`\>(`obj`, `def`?): \<`C`\>(`prop`) => `A`\[`C`\]

Takes an object and an optional fallback function and returns a function that
takes a string and returns the lookup value or the result default fallback.

## Type Parameters

• **A** *extends* `Record`\<`string` \| `number` \| `symbol`, `unknown`\>

• **B** *extends* (...`args`) => `any`

## Parameters

• **obj**: `A`

• **def?**: `B`

## Returns

`Function`

### Type Parameters

• **C** *extends* `string` \| `number` \| `symbol`

### Parameters

• **prop**: `string` \| `number` \| `symbol`

### Returns

`A`\[`C`\]

## Example

```ts
const colorTable = {
 FOO: [0, 0, 255, 155],
 BAR: [255, 0, 255, 155],
 FIZZ: [230, 0, 0, 155],
 BUZZ: [0, 128, 0, 155],
};

const colorLookup = tableLookup(colorTable, x => x ?? [128, 128, 128, 155]);
colorLookup(data.value);
```
