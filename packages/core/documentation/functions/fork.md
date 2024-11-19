[**@accelint/core**](../README.md) • **Docs**

***

[@accelint/core](../README.md) / fork

# Function: fork()

> **fork**\<`A`, `B`, `C`\>(`a`): \<`D`\>(`b`) => (`c`) => (`d`) => `C`

## Type Parameters

• **A**

• **B**

• **C**

## Parameters

• **a**

## Returns

`Function`

### Type Parameters

• **D**

### Parameters

• **b**

### Returns

`Function`

#### Parameters

• **c**

#### Returns

`Function`

##### Parameters

• **d**: `D`

##### Returns

`C`

## Alias

Phi

## Example

```ts
Phi((x) => (y) => x + y)(x => x + 3)(x => x - 2)(9)
// 19
```

## Defined in

[combinators/phi/index.ts:24](https://github.com/gohypergiant/standard-toolkit/blob/258694cea8ed8bbd956b3cf5da47c2c9debcf127/packages/core/src/combinators/phi/index.ts#L24)
