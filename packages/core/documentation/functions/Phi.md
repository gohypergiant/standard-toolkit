[**@accelint/core**](../README.md) • **Docs**

***

[@accelint/core](../README.md) / Phi

# Function: Phi()

> **Phi**\<`A`, `B`, `C`\>(`a`): \<`D`\>(`b`) => (`c`) => (`d`) => `C`

Pass a value through two different functions and the results to a function that takes two arguments.

Bird: `Phoenix`

Signature: (Big) Phi :: (a → b → c) → (d → a) → (d → b) → d → c

Lambda: λabcd.a(bd)(cd)

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

## Example

```ts
Phi((x) => (y) => x + y)(x => x + 3)(x => x - 2)(9)
// 19
```

## Defined in

[combinators/phi/index.ts:15](https://github.com/gohypergiant/standard-toolkit/blob/424b88fd48a5bcc02ed99ee27fd64cd73349aa30/packages/core/src/combinators/phi/index.ts#L15)
