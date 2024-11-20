[**@accelint/design-system**](../README.md) • **Docs**

***

[@accelint/design-system](../README.md) / TreeActions

# Type Alias: TreeActions\<T\>

> **TreeActions**\<`T`\>: `Omit`\<`TreeData`\<[`TreeNodes`](TreeNodes.md)\<`T`\>\>, `"items"` \| `"selectedKeys"` \| `"update"`\> & `object`

## Type declaration

### revertIsExpanded()

> **revertIsExpanded**: () => `void`

#### Returns

`void`

### toggleIsExpanded()

> **toggleIsExpanded**: (`selection`?, `isExpanded`?, `isRevertable`?) => `void`

#### Parameters

• **selection?**: `Selection`

• **isExpanded?**: `boolean`

• **isRevertable?**: `boolean`

#### Returns

`void`

### toggleIsSelected()

> **toggleIsSelected**: (`selection`?, `isSelected`?) => `void`

#### Parameters

• **selection?**: `Selection`

• **isSelected?**: `boolean`

#### Returns

`void`

### toggleIsViewable()

> **toggleIsViewable**: (`selection`?, `isViewable`?) => `void`

#### Parameters

• **selection?**: `Selection`

• **isViewable?**: `boolean`

#### Returns

`void`

### update()

> **update**: (`key`, `node`) => `void`

#### Parameters

• **key**: `Key`

• **node**: `Partial`\<[`TreeNodes`](TreeNodes.md)\<`T`\>\>

#### Returns

`void`

## Type Parameters

• **T**
