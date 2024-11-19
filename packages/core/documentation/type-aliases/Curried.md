[**@accelint/core**](../README.md) • **Docs**

***

[@accelint/core](../README.md) / Curried

# Type Alias: Curried()\<T, R\>

> **Curried**\<`T`, `R`\>: \<`P`\>(...`args`) => (...`args`) => `any` *extends* (...`args`) => `any` ? `Args` *extends* [] ? `R` : [`Curried`](Curried.md)\<`Args`, `R`\> : `never`

## Type Parameters

• **T** *extends* `unknown`[]

• **R**

## Type Parameters

• **P** *extends* `Partial`\<`T`\>

## Parameters

• ...**args**: `P`

## Returns

(...`args`) => `any` *extends* (...`args`) => `any` ? `Args` *extends* [] ? `R` : [`Curried`](Curried.md)\<`Args`, `R`\> : `never`

## Defined in

[composition/curry/index.ts:4](https://github.com/gohypergiant/standard-toolkit/blob/424b88fd48a5bcc02ed99ee27fd64cd73349aa30/packages/core/src/composition/curry/index.ts#L4)
