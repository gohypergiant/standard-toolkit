# Rspress Website

This documentation site project works within the Accelint Standard Toolkit (DevTK) and within that repo as a package in a monorepo.

To only run commands in this module/package of the monorepo prefix commands with:

```bash
# from the root of the repo
pnpm --filter @accelint/docs # ...
```

## Setup

Install the dependencies:

```bash
pnpm install
# or
pnpm --filter @accelint/docs install
```

## Get Started

Start the dev server:

```bash
pnpm --filter @accelint/docs dev
# or
pnpm --filter @accelint/docs run dev
```

Build the website for production:

```bash
pnpm --filter @accelint/docs build
# or
pnpm --filter @accelint/docs run build
```

Preview the production build locally:

```bash
pnpm --filter @accelint/docs preview
# or
pnpm --filter @accelint/docs run preview
```

## Interactive and "Rendered" Code Blocks

The RSPress plugin for "[playground](https://rspress.dev/plugin/official-plugins/playground)"s, or interactive code examples, is enabled by declaring a code block with <code>\`\`\`jsx playground</code> in `.mdx` documents; NOTE the file extension must be `.mdx`. Additionally the code block must export a React component.

```jsx playground
// ```jsx playground <--- declare code block with this line
export default const fun = () => <div>Fun!</div>
```

## API (docblock) Documentation

Documentation from the in-code docblocks are easily integrated into each page with the following snippet:

```mdx
import Typedoc from "../../typedocs/functions/<name-of-function>.md";

<Typedoc />
```

The relative path-ing - "../../" - will be dependent on the relative path-ing of each module.
