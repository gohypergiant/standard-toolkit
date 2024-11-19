[**@accelint/design-system**](../README.md) • **Docs**

***

[@accelint/design-system](../README.md) / MapLeafNodes

# Type Alias: MapLeafNodes\<Obj, LeafType\>

> **MapLeafNodes**\<`Obj`, `LeafType`\>: \{ \[Prop in keyof Obj\]: Obj\[Prop\] extends Primitive ? LeafType : Obj\[Prop\] extends Record\<string \| number, unknown\> ? MapLeafNodes\<Obj\[Prop\], LeafType\> : never \}

## Type Parameters

• **Obj**

• **LeafType**

## Defined in

[packages/design-system/src/types/vanilla-extract.ts:15](https://github.com/gohypergiant/standard-toolkit/blob/258694cea8ed8bbd956b3cf5da47c2c9debcf127/packages/design-system/src/types/vanilla-extract.ts#L15)
