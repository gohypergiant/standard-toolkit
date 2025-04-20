# Accelint Design Toolkit

This is the Accelint Design Toolkit, an open-source component library to serve as part of the entire ecosystem of UX for Accelint.

## Running locally

To run the local Storybook instance

```bash
pnpm i

pnpm --filter=@accelint/design-toolkit preview
```

If you run into errors, try running
`pnpm build` after you install the dependencies and then run the preview command again. If you don't have pnpm enabled then you can enable it with the command
[`corepack enable pnpm`](https://pnpm.io/installation#using-corepack) .

## Run a local build

```bash
pnpm --filter=@accelint/design-toolkit run build
```

## Run local example app

To demonstrate usage in a Nextjs app:

```bash
pnpm --filter "*apps/next" run dev
```


