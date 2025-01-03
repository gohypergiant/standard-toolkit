/** @type {Partial<import("typedoc").TypeDocOptions>} */
const config = {
  plugin: ['typedoc-plugin-markdown'],
  entryPointStrategy: 'packages',
  entryPoints: ['../../packages/*'],
  packageOptions: {
    entryPoints: ['src/index.ts'],
  },
  out: 'src/public/typedoc',

  // properties taken from plugin-typedoc https://github.com/web-infra-dev/rspress/blob/main/packages/plugin-typedoc/src/index.ts#L40-L53
  theme: 'markdown',
  disableSources: true,
  readme: 'none',
  githubPages: false,
  requiredToBeDocumented: ['Class', 'Function', 'Interface'],
  hideBreadcrumbs: true,
  hidePageHeader: true,
};

export default config;
