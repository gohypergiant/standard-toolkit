[**@accelint/core**](../README.md) • **Docs**

***

[@accelint/core](../README.md) / tap

# Function: tap()

> **tap**\<`T`, `R`\>(`fn`): (`val`) => `T`

Calls the given function with the passed value and returns the value unchanged.

## Type Parameters

• **T**

• **R**

## Parameters

• **fn**

## Returns

`Function`

### Parameters

• **val**: `T`

### Returns

`T`

## Signature

tap :: (a -> b) -> a -> a

## Example

```ts
tap(console.log)('foobar');
// foobar
```

## Defined in

[utility/tap/index.ts:11](https://github.com/gohypergiant/standard-toolkit/blob/424b88fd48a5bcc02ed99ee27fd64cd73349aa30/packages/core/src/utility/tap/index.ts#L11)
