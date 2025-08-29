# App Router

## General Structure

1. Avoid parallel routes (`@something/*`) unless you know very much what you are doing and that the use case is best solved with this feature and nothing else is comparable

#### Rules

1. Only include app router convention files e.g. `page.tsx`, `default.tsx`, `loading.tsx`, `error.tsx`, etc.
2. Exception to rule 1. is if you need isolated/specific styling on a page. If so you can collocate a `styles.module.css` file which is a convention requirement for Next.js.
3. It is good practice to always include a `loading.tsx` and `error.tsx` file as an absolute fallback in the event a feature does not contain them (which should not happen).
4. "API routes" are generally discouraged unless deemed absolutely necessary.
5. Turn on and take advantage of Partial Prerendering.
6. Where applicable break out async code into a separate function and wrap in `<Suspense />` to optimize the page for partial prerender.
