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

[combinators/phi/index.ts:24](https://github.com/gohypergiant/standard-toolkit/blob/7f574e64e57e697a3e2daabb1b78393aca67cb22/packages/core/src/combinators/phi/index.ts#L24)
