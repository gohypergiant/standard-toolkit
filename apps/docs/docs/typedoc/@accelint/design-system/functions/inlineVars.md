# Function: inlineVars()

## Call Signature

> **inlineVars**(`vars`): `Record`\<`string`, `string`\>

Runtime creation of inline style CSS vars that enable CSS container queries

### Parameters

#### vars

`Record`\<`string`, [`Primitive`](../type-aliases/Primitive.md)\>

### Returns

`Record`\<`string`, `string`\>

## Call Signature

> **inlineVars**\<`T`\>(`contract`, `values`): `Record`\<`string`, `string`\>

Runtime creation of inline style CSS vars that enable CSS container queries

### Type Parameters

• **T** *extends* [`Contract`](../type-aliases/Contract.md)

### Parameters

#### contract

`T`

#### values

[`PartialMapLeafNodes`](../type-aliases/PartialMapLeafNodes.md)\<`T`, [`Primitive`](../type-aliases/Primitive.md)\>

### Returns

`Record`\<`string`, `string`\>
