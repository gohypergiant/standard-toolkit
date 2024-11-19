[**@accelint/predicates**](../README.md) • **Docs**

***

[@accelint/predicates](../README.md) / isNothing

# Function: isNothing()

> **isNothing**(`val`): val is undefined \| null

Determines if the given value is undefined or null.

## Parameters

• **val**: `unknown`

## Returns

val is undefined \| null

## Example

```ts
if(isNothing(val)) {
  // error path...
}
```

## Defined in

[predicates/src/is-nothing/index.ts:9](https://github.com/gohypergiant/standard-toolkit/blob/7f574e64e57e697a3e2daabb1b78393aca67cb22/packages/predicates/src/is-nothing/index.ts#L9)
