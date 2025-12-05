# Features

## General Structure

Features in `src/features` follow one of two patterns depending on whether the component requires server-side rendering capabilities.

### Pattern A: Server-First (Recommended)

Used by: accordion, accordion-group, action-bar, avatar, badge, button, notice, tooltip

```
my-feature/
  index.tsx           # Server component entry point
  server.tsx          # Server component implementation
  error.tsx           # Client error boundary wrapper
  loading.tsx         # Suspense boundary wrapper
  variants.ts         # (Optional) Prop combinations for testing
  client.tsx          # (Optional) Client component for interactive testing
  my-feature.memlab.ts # (Optional) MemLab test configuration
```

### Pattern B: Client-Only

Used for components that are inherently client-side (portals, modals, etc.): dialog, drawer, intentional-leak

```
my-feature/
  client.tsx          # Full client component implementation
  my-feature.memlab.ts # MemLab test configuration
  variants.ts         # (Optional) Prop combinations
```

## Rules

1. For **server** component files (`index.tsx`, `server.tsx`), include `import 'server-only'`.
2. For **client** component files, include `'use client'` directive. The `error.tsx` file should also include `import 'client-only'`.
3. Always wrap features with `<ErrorBoundary />` and `<Suspense />` to handle error and loading states.
4. Feature domains should remain self-contained. Do not import from sibling features.

_Note: `index.tsx` is **NOT** a barrel export in this setup._

## Implementation Examples

### Pattern A: index.tsx

```tsx
import 'server-only';

import { ErrorComponent } from './error';
import { LoadingComponent } from './loading';
import { MyFeatureServer } from './server';

export function MyFeature() {
  return (
    <ErrorComponent>
      <LoadingComponent>
        <MyFeatureServer />
      </LoadingComponent>
    </ErrorComponent>
  );
}
```

### Pattern A: error.tsx

```tsx
'use client';

import 'client-only';
import { type PropsWithChildren } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

function Fallback() {
  return <div>Error</div>;
}

function onError(error: Error, info: { componentStack?: string | null }) {
  console.error(error, info.componentStack);
}

export function ErrorComponent({ children }: PropsWithChildren) {
  return (
    <ErrorBoundary fallback={<Fallback />} onError={onError}>
      {children}
    </ErrorBoundary>
  );
}
```

### Pattern A: loading.tsx

```tsx
import { type PropsWithChildren, Suspense } from 'react';

function Fallback() {
  return <div>Loading...</div>;
}

export function LoadingComponent({ children }: PropsWithChildren) {
  return <Suspense fallback={<Fallback />}>{children}</Suspense>;
}
```

### Pattern A: server.tsx

```tsx
import 'server-only';

import { MyComponent } from '@accelint/design-toolkit';
import { BentoItem } from '~/components/bento';
import { PROP_COMBOS } from './variants';

export function MyFeatureServer() {
  return (
    <>
      {PROP_COMBOS.map((props, index) => (
        <BentoItem key={index}>
          <MyComponent {...props} />
        </BentoItem>
      ))}
    </>
  );
}
```

### Pattern B: client.tsx

```tsx
'use client';

import { MyComponent } from '@accelint/design-toolkit';

export function MyFeature() {
  // Full client-side implementation
  return <MyComponent />;
}
```

## Why This Pattern?

#### We can help other developers understand intent

Using `import 'server-only'` and `import 'client-only'` indicates the intended usage of a component and where it should be rendered. This prevents server-specific code from "leaking" into client code and vice versa.

---

#### We can isolate error boundaries to the component itself

By including an explicit `ErrorBoundary` for a specific component, we have precise control over how errors are displayed. This prevents large portions of the application from becoming unusable and allows us to manage retry logic and recovery scenarios effectively.

---

#### We can isolate suspense boundaries to the component itself

Isolating suspense boundaries further down the component tree maximizes streaming capabilities. This provides greater flexibility for features such as [partial prerendering](https://nextjs.org/docs/app/building-your-application/rendering/partial-prerendering).

---

#### We can leverage any data fetching technique we want

- Can stream data to client component
- Can await data in server component
- Can use DAL functions directly
- Can call external APIs directly

## MemLab Testing

Features may include MemLab test files (`*.memlab.ts`) for memory leak detection. These files define test scenarios that exercise component mount/unmount cycles to identify potential memory leaks.

Client components used for MemLab testing typically include:
- `useStressTest` hook for automated mount/unmount cycles
- Data test IDs for test identification
- Interactive controls for manual testing
