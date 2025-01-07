# Function: fork()

> **fork**\<`A`, `B`, `C`\>(`a`): \<`D`\>(`b`) => (`c`) => (`d`) => `C`

## Type Parameters

• **A**

• **B**

• **C**

## Parameters

### a

(`x`) => (`y`) => `C`

## Returns

`Function`

### Type Parameters

• **D**

### Parameters

#### b

(`x`) => `A`

### Returns

`Function`

#### Parameters

##### c

(`x`) => `B`

#### Returns

`Function`

##### Parameters

###### d

`D`

##### Returns

`C`

## Alias

Phi

## Example

```ts
Phi((x) => (y) => x + y)(x => x + 3)(x => x - 2)(9)
// 19
```
