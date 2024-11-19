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

[utility/tap/index.ts:11](https://github.com/gohypergiant/standard-toolkit/blob/7f574e64e57e697a3e2daabb1b78393aca67cb22/packages/core/src/utility/tap/index.ts#L11)
