# Function: composition()

> **composition**\<`A`, `B`\>(`f`): \<`C`\>(`g`) => (`x`) => `B`

## Type Parameters

• **A**

• **B**

## Parameters

### f

(`z`) => `B`

## Returns

`Function`

### Type Parameters

• **C**

### Parameters

#### g

(`y`) => `A`

### Returns

`Function`

#### Parameters

##### x

`C`

#### Returns

`B`

## Alias

B

## Example

```ts
B((x) => x + 8)((x) => x * 3)(4);
// 20
```
