[**@accelint/design-system**](../README.md) • **Docs**

***

[@accelint/design-system](../README.md) / PartialMapLeafNodes

# Type Alias: PartialMapLeafNodes\<Obj, LeafType\>

> **PartialMapLeafNodes**\<`Obj`, `LeafType`\>: \{ \[Prop in keyof Obj\]?: Obj\[Prop\] extends Primitive ? LeafType : Obj\[Prop\] extends Record\<string \| number, unknown\> ? PartialMapLeafNodes\<Obj\[Prop\], LeafType\> : never \}

## Type Parameters

• **Obj**

• **LeafType**
