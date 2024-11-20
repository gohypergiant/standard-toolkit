[**@accelint/design-system**](../README.md) • **Docs**

***

[@accelint/design-system](../README.md) / UseTreeOptions

# Type Alias: UseTreeOptions\<T\>

> **UseTreeOptions**\<`T`\>: `object`

## Type Parameters

• **T**

## Type declaration

### allowsExpansion?

> `optional` **allowsExpansion**: `boolean`

### allowsVisibility?

> `optional` **allowsVisibility**: `boolean`

### nodes

> **nodes**: [`TreeNodes`](TreeNodes.md)\<`T`\>[]

### onSelectionChange()?

> `optional` **onSelectionChange**: (`keys`) => `void`

#### Parameters

• **keys**: `Selection`

#### Returns

`void`

### onUpdate()?

> `optional` **onUpdate**: (`nodes`) => `void`

Due to being triggered during the render cycle, this event
handler should not be tied to any state change updates

#### Parameters

• **nodes**: [`TreeNodes`](TreeNodes.md)\<`T`\>[]

#### Returns

`void`

### selectionMode?

> `optional` **selectionMode**: `SelectionMode`
