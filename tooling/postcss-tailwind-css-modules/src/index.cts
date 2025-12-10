// This hack shamelessly stolen from the tailwind postcss plugin: https://github.com/tailwindlabs/tailwindcss/blob/main/packages/%40tailwindcss-postcss/src/index.cts

// @ts-ignore
import globalGroupPostcssPlugin from './index.ts'

// This is used instead of `export default` to work around a bug in
// `postcss-load-config`
// @ts-ignore
export = globalGroupPostcssPlugin
