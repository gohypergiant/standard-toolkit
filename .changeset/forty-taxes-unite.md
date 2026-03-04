---
"@accelint/core": minor
---

Enabled the creation of stable uuids with the existing `uuid` function.

The `uuid` function now accepts optional parameters to establish a namespace and path for the creation of stable ids across runtime calls.

```typescript
 import { uuid } from '@accelint/core';
 
 // To create a new uuid, use:
 const dynamicId = uuid();
 
 // To create a stable static uuid, use:
 const stableId = uuid({ path: ['foo', 'bar'] });
 
 // To create a stable dynamic uuid, use:
 const stableDynamicId = uuid({ path: ['foo', entity.id] }); // Will always result in the same id, if the input is the same
 
 // To establish a namespace, create a static const or use the `stableId` example to create a uuid
 const namespace = '550e8400-e29b-41d4-a716-446655440000'; // Completely static
 // OR
 const namespace = uuid({ path: ['my', 'app']}); // Created at runtime, but stable
 
 // These will be equal because all inputs match
 uuid({ path: ['foo', 'bar'] }) === uuid({ path: ['foo', 'bar'] });
 
 uuid({ namespace, path: ['foo', 'bar'] }) === uuid({ namespace, path: ['foo', 'bar'] });
 
 // These will not be equal, even though their path's match
 uuid({
   namespace: '550e8400-e29b-41d4-a716-446655440000',
   path: ['foo', 'bar']
 })
 
 uuid({
   namespace: uuid({ path: ['my', 'app']}),
   path: ['foo', 'bar']
 })
 ```
