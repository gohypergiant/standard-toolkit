[**@accelint/design-system**](../README.md) • **Docs**

***

[@accelint/design-system](../README.md) / useSlot

# Function: useSlot()

> **useSlot**(): [`RefCallback`\<`Element`\>, `boolean`]

Detects whether a slot has been utilized

Example:
Parent component implements RAC Provider, with a slotted context
Child component implements slot prop matching provided slot in context
Parent is able to see that the slot has been fulfilled

Copied from RAC: https://github.com/adobe/react-spectrum/blob/main/packages/react-aria-components/src/utils.tsx#L213
Due to not being exported, but quite handy

## Returns

[`RefCallback`\<`Element`\>, `boolean`]

## Defined in

[packages/design-system/src/hooks/use-slot/use-slot.ts:20](https://github.com/gohypergiant/standard-toolkit/blob/258694cea8ed8bbd956b3cf5da47c2c9debcf127/packages/design-system/src/hooks/use-slot/use-slot.ts#L20)
