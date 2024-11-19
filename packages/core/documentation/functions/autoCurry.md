[**@accelint/core**](../README.md) • **Docs**

***

[@accelint/core](../README.md) / autoCurry

# Function: autoCurry()

> **autoCurry**\<`T`\>(`fn`, `_args`): [`Curried`](../type-aliases/Curried.md)\<`Parameters`\<`T`\>, `ReturnType`\<`T`\>\>

Curries the given function. Allowing it to be accept one or more arguments at a time.

## Type Parameters

• **T** *extends* (...`args`) => `any`

## Parameters

• **fn**: `T`

• **\_args**: `any`[] = `...`

## Returns

[`Curried`](../type-aliases/Curried.md)\<`Parameters`\<`T`\>, `ReturnType`\<`T`\>\>

## Example

```ts
const curried = autoCurry((a, b, c) => (a + b) * c);
curried(2)(3)(4);
curried(2, 3)(4);
curried(2)(3, 4);
curried(2, 3, 4);
```

## Defined in

[composition/curry/index.ts:22](https://github.com/gohypergiant/standard-toolkit/blob/258694cea8ed8bbd956b3cf5da47c2c9debcf127/packages/core/src/composition/curry/index.ts#L22)
