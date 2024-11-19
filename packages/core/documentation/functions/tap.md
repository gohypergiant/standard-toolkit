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

[utility/tap/index.ts:11](https://github.com/gohypergiant/standard-toolkit/blob/258694cea8ed8bbd956b3cf5da47c2c9debcf127/packages/core/src/utility/tap/index.ts#L11)
