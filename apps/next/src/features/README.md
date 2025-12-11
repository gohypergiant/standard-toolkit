# Features

## General Structure

The following pattern should be applied to anything located in `src/features`:

```
my-feature/
  client.tsx
  error.tsx
  index.tsx
  loading.tsx
  server.tsx
  styles.css.ts
```

#### "Rules"

1. For all **server** component files, ensure that `import 'server-only'` is included. This does not need to be added in non-JSX files, such as `styles.css.ts` or `constants.ts`.
2. For all **client** component files, make sure to include `"use client"` and `import 'client-only'`. These statements are not required in non-JSX files, like `styles.css.ts` or `constants.ts`.
3. Whenever possible, leverage rendering with `{children}` to allow for the interleaving and composition of client and server components.
4. Always include a `<Suspense />` and `<ErrorBoundary />` for the feature to handle error and loading states.
5. Features must be self-contained and should not import from sibling features.

_Note that `index.tsx` is **NOT** a barrel export in this setup._

## Why?

#### We can help other developers understand intent

Using `import 'server-only'` and `import 'client-only'` is an effective way to indicate the intended usage of a component and where it should be rendered. This practice helps prevent server-specific code from "leaking" into client code and vice versa. These imports should only be included in files that contain JSX. For other files, such as `styles.css.ts` (Vanilla Extract) or more general files like `utils.ts`, you should omit these imports. This approach allows those files to be used in either client or server components, or both.

---

#### We can interleave client and server components freely

So long as we properly render `{children}`, this pattern is completely composable from a server and client component perspective. Meaning we can technically nest this pattern either implicitly or explicitly in userland code. E.g. say we have a more complex component, assuming each folder has the same structure:

```
my-component/
  client.tsx
  error.tsx
  index.tsx
  loading.tsx
  server.tsx

  // nested inside
  my-component-child/
    client.tsx
    error.tsx
    index.tsx
    loading.tsx
    server.tsx
```

We can either implicitly compose them in the `my-component/index.tsx` file:

```jsx
function MyComponent() {
  return (
    <ErrorBoundary fallback={<MyComponentError />}>
      <Suspense fallback={<MyComponentLoading />}>
        <MyComponentServer>
          <MyComponentChild />
        </MyComponentServer>
      </Suspense>
    </ErrorBoundary>
  );
}
```

or allow for composition to happen explicitly:

```jsx
function MyComponent(props) {
  const { children } = props;

  return (
    <ErrorBoundary fallback={<MyComponentError />}>
      <Suspense fallback={<MyComponentLoading />}>
        <MyComponentServer>{children}</MyComponentServer>
      </Suspense>
    </ErrorBoundary>
  );
}

// In userland code
<MyComponent>
  <MyComponentChild />
</MyComponent>;
```

We prefer the latter pattern because it enables better optimization of the component tree and provides tighter control over the interleaving of client and server components.

---

#### We can isolate errors boundaries to the component itself

One of the great features of the app router is its automatic insertion of an error boundary when an `error.tsx` file is located in an app router folder. However, there are often times when we want to isolate errors further down the tree to prevent large portions of the application from becoming unusable. By including an explicit `ErrorBoundary` alongside a custom `error.tsx` file for a specific component, we can have more precise control over how errors are displayed. This also allows us to manage the retry logic and other recovery scenarios more effectively.

---

#### We can isolate suspense boundaries to the component itself

A notable feature of the app router is its automatic insertion of a suspense boundary when a `loading.tsx` file is present in an app router folder. However, it is often beneficial to isolate a suspense boundary further down the component tree to maximize streaming capabilities. By explicitly adding a `Suspense` component and a custom `loading.tsx` file for the specific component, we can better control the display of elements like skeleton loaders. This approach also provides greater flexibility for features such as [partial prerendering](https://nextjs.org/docs/app/building-your-application/rendering/partial-prerendering).

---

#### We can leverage any data fetching technique we want

- Can stream data to client component
- Can await data in server component
- Can use DAL functions directly
- Can call external APIs directly

## Notes

The `server.tsx` file is optional if your situation requires only the use of a client component. In this case your `index.tsx` would look something like:

```jsx
function MyComponent() {
  return (
    <ErrorBoundary fallback={<MyComponentError />}>
      <Suspense fallback={<MyComponentLoading />}>
        <MyComponentClient />
      </Suspense>
    </ErrorBoundary>
  );
}
```
