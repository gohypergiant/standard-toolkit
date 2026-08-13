# StandardTK Nextjs Test Bed

This is a Next.js application that lives alongside the Standard Toolkit packages and consumes them as a real application would. Its purpose is to develop and validate library features in a production-like environment. After building the workspace packages, your local library changes are available here to exercise directly in app context.

Use it two ways:

- **As a development environment** for iterating on library features against a real app, including behavior that unit tests and Storybook don't surface — server-side rendering, routing, and full-page composition.
- **As a home for durable tests** that need an application context, such as the component pages and the memory leak suite documented below.

## Setup

Run these once from the **repo root** before working in the test bed. Because the
app consumes the toolkit packages as workspace dependencies, the packages must be
built before the app can resolve them.

1. Install all workspace dependencies:

```sh
pnpm install
```

2. Build the toolkit packages so the app can consume them:

```sh
pnpm run build
```

> Re-run `pnpm run build` whenever you change a library package and want those
> changes reflected here.

## Running the App

These commands are scoped to this app with `--filter=@apps/next`, so you can run
them from anywhere in the repo. Note that if you don't see the library changes, you can kill node modules and re-install. It can also be a useful way to understand what is exported from the library and whether your feature has the API that you want it to have.

```sh
pnpm --filter=@apps/next run dev
```

  The app is served at [http://localhost:3000](http://localhost:3000).

- **Build** a production bundle of the app:

```sh
pnpm --filter=@apps/next run build
```

- **Serve** the production build locally (run `build` first):

```sh
pnpm --filter=@apps/next run start
```

## Integration Tests (Playwright)

The integration tests run with [Playwright](https://playwright.dev). Installing
dependencies with `pnpm install` does **not** download the browser binaries
Playwright needs — those are cached globally on your machine and must be
installed once per machine.

1. Download the browser binary (Chromium is the only browser configured):

```sh
pnpm --filter=@apps/next exec playwright install chromium
```

> The `--filter=@apps/next` flag is required: the `playwright` binary is only
> linked in `apps/next/node_modules`, so running `pnpm exec playwright` from the
> repo root fails with `command not found`.

2. Run the tests:

```sh
pnpm --filter=@apps/next run test:integration
```

3. Run the tests in headed mode (watch the browser drive the UI):

```sh
pnpm --filter=@apps/next run test:integration:headed
```

## Visual Regression Tests

Visual regression tests capture screenshots of components and compare them
against baseline images to detect unintended visual changes. Baselines are
captured on Linux in CI for consistency, so these tests run in CI only.

See [`src/visual-regression/README.md`](./src/visual-regression/README.md) for
details on structure, writing tests, and updating baselines.

## Memory Leak Tests

Memory leak tests use [MemLab](https://facebook.github.io/memlab/) and Playwright
to detect detached DOM nodes and leaked memory in components by repeatedly
mounting and unmounting them, then analyzing heap snapshots against baselines.

See [`src/memlab/README.md`](./src/memlab/README.md) for details on running,
configuring thresholds, and updating baselines.
