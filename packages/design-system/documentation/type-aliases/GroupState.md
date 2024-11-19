[**@accelint/design-system**](../README.md) • **Docs**

***

[@accelint/design-system](../README.md) / GroupState

# Type Alias: GroupState

> **GroupState**: `object`

## Type declaration

### count

> **count**: `number`

The number of children rendered

### orientation

> **orientation**: `Orientation`

### reverse

> **reverse**: `boolean`

Whether to flip the order of the children, visually

### type

> **type**: `string`

This is based off of the children types

Possible values: Empty, Mixed, {component type}

#### Example

```ts
If all children are <Button />, then "type" will be `Button`
```

## Defined in

[packages/design-system/src/components/group/types.ts:19](https://github.com/gohypergiant/standard-toolkit/blob/258694cea8ed8bbd956b3cf5da47c2c9debcf127/packages/design-system/src/components/group/types.ts#L19)
