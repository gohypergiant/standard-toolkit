[**@accelint/core**](../README.md) • **Docs**

***

[@accelint/core](../README.md) / shift

# Function: shift()

> **shift**\<`T`\>(`arr`): [`T`, `T`[]]

Returns a tuple containing the first element (head) of the given array and
the remaining elements of the array (tail).

## Type Parameters

• **T**

## Parameters

• **arr**: `T`[]

## Returns

[`T`, `T`[]]

## Example

```ts
shift([1, 2, 3, 4]);
// [1, [2, 3, 4, 5]]
```
