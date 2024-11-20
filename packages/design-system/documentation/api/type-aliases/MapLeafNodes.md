[**@accelint/design-system**](../README.md) • **Docs**

***

[@accelint/design-system](../README.md) / MapLeafNodes

# Type Alias: MapLeafNodes\<Obj, LeafType\>

> **MapLeafNodes**\<`Obj`, `LeafType`\>: \{ \[Prop in keyof Obj\]: Obj\[Prop\] extends Primitive ? LeafType : Obj\[Prop\] extends Record\<string \| number, unknown\> ? MapLeafNodes\<Obj\[Prop\], LeafType\> : never \}

## Type Parameters

• **Obj**

• **LeafType**
