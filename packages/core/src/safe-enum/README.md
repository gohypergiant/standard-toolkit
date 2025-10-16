[Don't use Enums in Typescript, they are very dangerous 😨](https://dev.to/ivanzm123/dont-use-enums-in-typescript-they-are-very-dangerous-57bh)

TypeScript Enums have issue and can cause unexpected bugs due to how they work. To help ensure stability we can use the
safe enum alternative. This library provides the utility types and functions to make this work trivial. These safe enums
are completely compatible wherever you would use a traditional TypeScript Enum.

## Usage

```typescript
// enums/some-enum.ts
import { type SafeEnum, getSafeEnumValues } from "@accelint/core";

// Create the enum. `Object.freeze` is not neccessary but recommended.
export const StopLight = Object.freeze({
  Red: "red",
  Yellow: "yellow",
  Green: "green",
} as const); // It is critical that you end your enum object with `as const` 

export type StopLightState = SafeEnum<typeof StopLight>; // => 'red' | 'yellow' | 'green'

export const stopLightValues = getSafeEnumValues(StopLight); // => ['red', 'yellow', 'green']

```

Once created the safe enum works like any other enum.

```typescript

function doSomething(value: StopLight) {
  // ...
}

const enumValue = StopLight.Green;

pgEnum('some_enum', stopLightValues);

```

## Limitations

There are some limits to what you can and cannot do with safe enums.

1. Enum object must end with `as const`, this tells TypeScript that the object values are fixed and allows for static typing.
2. Keys must be a string.
3. Values must exclusively be strings or numbers.
4. You need to export the safe enum type for the overriding to work properly.
