[**@accelint/core**](../README.md) • **Docs**

***

[@accelint/core](../README.md) / composeLens

# Function: composeLens()

> **composeLens**\<`A`, `B`, `C`\>(`ab`, `bc`): [`Lens`](../type-aliases/Lens.md)\<`A`, `C`\>

Compose two lenses together.

Given a lens `A ⭢ B` and a lens `B ⭢ C`, produces a lens `A ⭢ C`.

## Type Parameters

• **A**

• **B**

• **C**

## Parameters

• **ab**: [`Lens`](../type-aliases/Lens.md)\<`A`, `B`\>

• **bc**: [`Lens`](../type-aliases/Lens.md)\<`B`, `C`\>

## Returns

[`Lens`](../type-aliases/Lens.md)\<`A`, `C`\>

## Example

```ts
const addressLens = lens(
  (person: Person) => property(person)('address'),
  (person) => (addr) => associateDeep(person)('address')(addr)
);
const cityLens = lens(
  (address?: Address) => optionalProperty(address)('city'),
  (address) => (city) => associateDeep(address)('city')(city)
);

const personCityLens = composeLens(addressLens, cityLens);
```

## Defined in

[object/lens/index.ts:58](https://github.com/gohypergiant/standard-toolkit/blob/424b88fd48a5bcc02ed99ee27fd64cd73349aa30/packages/core/src/object/lens/index.ts#L58)
