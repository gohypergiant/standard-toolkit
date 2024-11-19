[**@accelint/design-system**](../README.md) • **Docs**

***

[@accelint/design-system](../README.md) / TreeItemState

# Type Alias: TreeItemState

> **TreeItemState**: `Omit`\<[`TreeItemRenderProps`](TreeItemRenderProps.md)\<`unknown`\>, `"node"`\> & `Required`\<`Pick`\<[`TreeGroupNode`](TreeGroupNode.md)\<`unknown`\>, `"isExpanded"` \| `"isViewable"` \| `"isVisible"`\>\> & `Omit`\<`BaseTreeItemProps`\<`unknown`\>, `"node"`\> & `object`

## Type declaration

### count

> **count**: `number`

The number of children

### isGroup

> **isGroup**: `boolean`

If item has children

## Defined in

[packages/design-system/src/components/tree/types.ts:144](https://github.com/gohypergiant/standard-toolkit/blob/258694cea8ed8bbd956b3cf5da47c2c9debcf127/packages/design-system/src/components/tree/types.ts#L144)
