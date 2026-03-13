const RAC_PACKAGES = [
  'react-aria', // covers react-aria-components
  'react-stately',
  '@react-aria/'
]

module.exports = {
  finders: {
    rac: (ctx) => {
      return RAC_PACKAGES.some((value) => ctx.name.includes(value));
    }
  }
}
