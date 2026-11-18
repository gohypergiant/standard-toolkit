# Getting Started

1. Install [node.js and npm](https://nodejs.org/en)
    - Use the correct [engine version](package.json) via [n](https://www.npmjs.com/package/n), [nvm](https://github.com/nvm-sh/nvm), [fnm](https://github.com/Schniz/fnm), or similar
2. Use or install [pnpm](https://pnpm.io/): `corepack enable pnpm` or `curl -fsSL https://get.pnpm.io/install.sh | sh -`
    - The repo pins the pnpm version in `package.json` `packageManager`. If `pnpm` fails with `ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING`, an outdated corepack is running it. Check `which pnpm`. A shim from an old global corepack (for example `/usr/local/bin/pnpm`) can shadow the one that ships with your Node version. Run `corepack enable pnpm` with your current Node, or upgrade corepack.
3. Install dependencies: `pnpm install`
4. Sanity check that everything is working via: `pnpm test`

## Optional

Configure your Git to use a [commit template](https://gist.github.com/lisawolderiksen/a7b99d94c92c6671181611be1641c733#git-configuration).

```bash
git config --global commit.template ~/.gitmessage
```
