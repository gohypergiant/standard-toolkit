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
