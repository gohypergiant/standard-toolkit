# Function: swappedNullishOrFn()

> **swappedNullishOrFn**\<`T`, `A`\>(`a`): \<`B`\>(`b`) => (`c`) => `A` \| `NonNullable`\<`B`\>

Swapped Nullish Coalescing: `b(x) ?? a(x)`

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

`A` \| `NonNullable`\<`B`\>

## Example

```ts
swappedNullishOrFn(x => x.bar)(x => x.foo)({ bar: 4 });
// 4
```
