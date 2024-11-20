[**@accelint/design-system**](../README.md) • **Docs**

***

[@accelint/design-system](../README.md) / containerQuery

# Function: containerQuery()

> **containerQuery**\<`T`\>(`contract`, `query`): `string`

Create simple or complex container queries with and/or operators.

To provide type safety and ease of use, this function accepts a generic and a contract
The generic type defines the possible values for the parameters defined within the contract

Ex: containerQuery<{ foo: boolean }>({ foo: 'var(--foo)' }, { foo: true })

By providing the type constraint and contract, the query parameters will have intellisense
on which parameters exist and what their possible values can be

## Type Parameters

• **T** *extends* `CssVarValues` = `CssVarValues`

## Parameters

• **contract**: [`MapLeafNodes`](../type-aliases/MapLeafNodes.md)\<`Omit`\<`T`, keyof `ContainerQueryOptions`\>, `CSSVarFunction`\>

• **query**: `ContainerQueryValues`\<`T`\> \| `MultiContainerQuery`\<`T`\>

## Returns

`string`

## Examples

```ts
containerQuery(contract, { a: true })
// returns (a: true)
```

```ts
containerQuery(contract, { a: true, b: true })
// returns (a: true) and (b: true)
```

```ts
containerQuery(contract, { operator: 'or', a: true, b: true })
// returns (a: true) or (b: true)
```

```ts
containerQuery(contract, { groups: [{ a: true }, { b: true }] })
// returns (a: true) or (b: true)
```

```ts
containerQuery(contract, { a: ['foo', 'bar'] })
// returns (a: 'foo') or (a: 'bar')
```

```ts
containerQuery(contract, { a: ['foo', 'bar'], b: true })
// returns ((a: 'foo') or (a: 'bar')) and (b: true)
```

```ts
containerQuery(contract, { operator: 'or', a: ['foo', 'bar'], b: true })
// returns ((a: 'foo') or (a: 'bar')) or (b: true)
```

```ts
containerQuery(contract, { groups: [{ a: true, b: true }, { c: true, d: true }] })
// returns ((a: true) and (b: true)) or ((c: true) and (d: true))
```

```ts
containerQuery(contract, { operator: 'and', groups: [{ operator: 'or', a: true, b: true }, { c: true, d: true }] })
// returns ((a: true) or (b: true)) and ((c: true) and (d: true))
```

```ts
containerQuery(contract, { operator: 'and', groups: [{ operator: 'or', a: true, b: true }, { operator: 'or', c: true, d: true }] })
// returns ((a: true) or (b: true)) and ((c: true) or (d: true))
```
