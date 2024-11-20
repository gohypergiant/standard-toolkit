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
