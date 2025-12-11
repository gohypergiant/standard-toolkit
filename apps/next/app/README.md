# App Router

## Rules

1. Only include app router convention files e.g. `page.tsx`, `default.tsx`, `loading.tsx`, `error.tsx`, etc.
2. Exception to rule 1. is if you need isolated/specific styling on a page that will be wholly unique to that page. If so you can collocate a `styles.module.css` file which is a convention requirement for Next.js.
3. It is good practice to always include a `loading.tsx` and `error.tsx` file as an absolute fallback in the event a feature does not contain them (which should not happen).
4. "API routes" are generally discouraged unless deemed absolutely necessary to ensure we don't conflate a proper backend server / service with what Next.js is optimized for (a server runtime for React).
5. Turn on and take advantage of experimental features such as Partial Prerendering and React Compiler as you see fit.
6. Where applicable break out async code into a separate function and wrap in `<Suspense />` to optimize the page for partial prerenders. This should happen naturally with proper structure applied to Features.
