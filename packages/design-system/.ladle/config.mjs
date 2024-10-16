/** @type {import('@ladle/react').UserConfig} */
export default {
  base: '/standard-toolkit/',
  addons: {
    theme: {
      defaultState: 'dark',
    },
  },
  storyOrder: [
    'tokens--generic-colors',
    'tokens--semantic-colors',
    'tokens*',
    'primitives*',
    'hooks*',
    'components*',
  ],
};
