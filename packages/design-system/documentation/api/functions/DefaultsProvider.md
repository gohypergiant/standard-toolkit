[**@accelint/design-system**](../README.md) • **Docs**

***

[@accelint/design-system](../README.md) / DefaultsProvider

# Function: DefaultsProvider()

> **DefaultsProvider**(`__namedParameters`): `Element`

Set default props for any component, to be merged in with props at point
of implementation. Global defaults take lower priority than props from
composition context or props attached to instance

Nested instances of this provider will shallow merge defaults from parent
context, with the defaults prop taking precedence

## Parameters

• **\_\_namedParameters**: [`DefaultsProviderProps`](../type-aliases/DefaultsProviderProps.md)

## Returns

`Element`
