# Getting Started

1. Install [node.js and npm](https://nodejs.org/en)
    - Use the correct [engine version](package.json) via [n](https://www.npmjs.com/package/n), [nvm](https://github.com/nvm-sh/nvm), [fnm](https://github.com/Schniz/fnm), or similar
2. Use or install [pnpm](https://pnpm.io/): `corepack enable pnpm` or `curl -fsSL https://get.pnpm.io/install.sh | sh -`
3. Install dependencies: `pnpm install`
4. Sanity check that everything is working via: `pnpm test`

## Optional

Configure your Git to use a [commit template](https://gist.github.com/lisawolderiksen/a7b99d94c92c6671181611be1641c733#git-configuration).

```bash
git config --global commit.template ~/.gitmessage
```
