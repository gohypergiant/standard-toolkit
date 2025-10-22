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

## Helpful extensions for VSCode

If you use Visual Studio Code, there are some helpful extensions you can install when working with Tailwind and Biome.

- [`Biome`](https://marketplace.visualstudio.com/items/?itemName=biomejs.biome)
- [`Tailwind CSS Intellisense`](https://marketplace.visualstudio.com/items/?itemName=bradlc.vscode-tailwindcss)
- [`Class Collapse`](https://marketplace.visualstudio.com/items/?itemName=Etsi0.class-collapse)

Also add the following to your `settings.json` file for VSCode:

```json
    "editor.codeActionsOnSave": {
        "quickfix.biome": "explicit"
    },
    "tailwindCSS.includeLanguages": {
        "javascript": "javascript",
        "typescript": "typescript",
        "html": "html",
        "typescriptreact": "html",
        "javascriptreact": "html"
    },
    "tailwindCSS.experimental.classRegex": [
        [
            "/\\*tw\\*/ '([^']*)'"
        ],
        [
            "([\"'`][^\"'`]*.*?[\"'`])",
            "[\"'`]([^\"'`]*).*?[\"'`]"
        ],
    ],
    "files.associations": {
        "*.css": "tailwindcss"
    }
```

## In Depth Documentation

Be sure to view topic specific documentation to understand technology choices, best practices, established patterns, and enforced opinions.

- [React](./src/documentation/react.md)
- [Tailwind](./src/documentation/tailwind.md)
