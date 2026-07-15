export const appName = 'Lyntris Dev Toolkit';
export const docsRoute = '/docs';
export const docsImageRoute = '/og/docs';
export const docsContentRoute = '/llms.mdx/docs';
export const baseUrl = process.env.NODE_ENV === 'development'
    ? new URL('http://localhost:3000')
    : new URL('https://standard-toolkit.accelint.io');

export const gitConfig = {
  user: 'gohypergiant',
  repo: 'standard-toolkit',
  branch: 'main',
};
