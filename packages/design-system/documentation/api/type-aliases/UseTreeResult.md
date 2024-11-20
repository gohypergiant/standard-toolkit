[**@accelint/design-system**](../README.md) • **Docs**

***

[@accelint/design-system](../README.md) / UseTreeResult

# Type Alias: UseTreeResult\<T\>

> **UseTreeResult**\<`T`\>: `Required`\<`Omit`\<[`UseTreeOptions`](UseTreeOptions.md)\<`T`\>, `"nodes"` \| `"onSelectionChange"` \| `"onUpdate"`\>\> & `Pick`\<`TreeData`\<[`TreeNodes`](TreeNodes.md)\<`T`\>\>, `"selectedKeys"`\> & `object`

## Type declaration

### actions

> **actions**: [`TreeActions`](TreeActions.md)\<`T`\>

DO NOT DESTRUCTURE THIS PROPERTY

The underlying useTreeData hook relies on "this" within certain methods
and destructuring the actions will cause errors to be thrown

### lookup

> **lookup**: `Record`\<`Key`, [`TreeNode`](TreeNode.md)\<`T`\>\>

### tree

> **tree**: [`TreeNode`](TreeNode.md)\<`T`\>

## Type Parameters

• **T**
