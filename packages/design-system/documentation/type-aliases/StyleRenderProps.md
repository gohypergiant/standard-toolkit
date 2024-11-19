[**@accelint/design-system**](../README.md) • **Docs**

***

[@accelint/design-system](../README.md) / StyleRenderProps

# Type Alias: StyleRenderProps\<T\>

> **StyleRenderProps**\<`T`\>: `object`

## Type Parameters

• **T** *extends* `object`

## Type declaration

### className?

> `optional` **className**: [`RenderPropsClassName`](RenderPropsClassName.md)\<`T`\>

The CSS [className](https://developer.mozilla.org/en-US/docs/Web/API/Element/className) for the element. A function may be provided to compute the class based on component state.

### style?

> `optional` **style**: [`RenderPropsStyle`](RenderPropsStyle.md)\<`T`\>

The inline [style](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/style) for the element. A function may be provided to compute the style based on component state.

## Defined in

[packages/design-system/src/types/react-aria.ts:31](https://github.com/gohypergiant/standard-toolkit/blob/258694cea8ed8bbd956b3cf5da47c2c9debcf127/packages/design-system/src/types/react-aria.ts#L31)
