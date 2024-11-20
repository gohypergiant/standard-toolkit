[**@accelint/core**](../README.md) • **Docs**

***

[@accelint/core](../README.md) / lens

# Function: lens()

> **lens**\<`T`, `V`\>(`getter`, `setter`): [`Lens`](../type-aliases/Lens.md)\<`T`, `V`\>

Focus on and manipulate a specific property or substructure within an object.

## Type Parameters

• **T**

• **V**

## Parameters

• **getter**: `LenseGet`\<`T`, `V`\>

• **setter**: `LenseSet`\<`T`, `V`\>

## Returns

[`Lens`](../type-aliases/Lens.md)\<`T`, `V`\>

## Example

```ts
const nameLens = lens(
  (person: Person) => person.name,
  (person, name) => ({ ...person, name })
);

const name = nameLens.get(person);

const { get: getUsername, set: setUsername } = lens(
  (user: User) => property(user)('username'),
  (user, name) => associateDeep(user)('username')(name)
);

const username = getUsername(user);
```
