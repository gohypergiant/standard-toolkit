[**@accelint/worker**](../README.md) • **Docs**

***

[@accelint/worker](../README.md) / create

# Function: create()

> **create**\<`Functions`\>(`createFn`): `object`

## Type Parameters

• **Functions** *extends* `Actions`

## Parameters

• **createFn**

## Returns

`object`

### destroy()

> **destroy**: () => `void`

#### Returns

`void`

### instance

> **instance**: `Worker` \| `SharedWorker` = `worker`

### run()

> **run**: \<`FunctionName`, `FunctionCall`\>(`functionName`, ...`args`) => `Promise`\<`ReturnType`\<`FunctionCall`\>\>

#### Type Parameters

• **FunctionName** *extends* `string` \| `number` \| `symbol`

• **FunctionCall** *extends* (...`args`) => `any`

#### Parameters

• **functionName**: `FunctionName`

• ...**args**: `Parameters`\<`FunctionCall`\>

#### Returns

`Promise`\<`ReturnType`\<`FunctionCall`\>\>

## Defined in

[index.ts:38](https://github.com/gohypergiant/standard-toolkit/blob/258694cea8ed8bbd956b3cf5da47c2c9debcf127/packages/web-worker/src/worker/index.ts#L38)
