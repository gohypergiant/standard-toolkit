[**@accelint/design-system**](../README.md) • **Docs**

***

[@accelint/design-system](../README.md) / inlineVars

# Function: inlineVars()

## inlineVars(vars)

> **inlineVars**(`vars`): `Record`\<`string`, `string`\>

Runtime creation of inline style CSS vars that enable CSS container queries

### Parameters

• **vars**: `Record`\<`string`, [`Primitive`](../type-aliases/Primitive.md)\>

### Returns

`Record`\<`string`, `string`\>

### Defined in

[packages/design-system/src/utils/css.ts:420](https://github.com/gohypergiant/standard-toolkit/blob/258694cea8ed8bbd956b3cf5da47c2c9debcf127/packages/design-system/src/utils/css.ts#L420)

## inlineVars(contract, values)

> **inlineVars**\<`T`\>(`contract`, `values`): `Record`\<`string`, `string`\>

### Type Parameters

• **T** *extends* [`Contract`](../type-aliases/Contract.md)

### Parameters

• **contract**: `T`

• **values**: [`PartialMapLeafNodes`](../type-aliases/PartialMapLeafNodes.md)\<`T`, [`Primitive`](../type-aliases/Primitive.md)\>

### Returns

`Record`\<`string`, `string`\>

### Defined in

[packages/design-system/src/utils/css.ts:424](https://github.com/gohypergiant/standard-toolkit/blob/258694cea8ed8bbd956b3cf5da47c2c9debcf127/packages/design-system/src/utils/css.ts#L424)
