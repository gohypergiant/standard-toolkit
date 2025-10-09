import { dedent } from 'radashi';

declare namespace globalThis {
  const __HOTKEY_DUPLICATE_CHECK_SYMBOL: symbol;
}

const duplicateCheckSymbol = Symbol('hotkey-duplicate-check');

// @ts-expect-error - This is where the key is initialized
globalThis.__HOTKEY_DUPLICATE_CHECK_SYMBOL ??= duplicateCheckSymbol;

if (globalThis.__HOTKEY_DUPLICATE_CHECK_SYMBOL !== duplicateCheckSymbol) {
  throw new Error(
    dedent`
      @accelint-private/react-hotkey-manager is already initialized. Only one instance of the library can be used at a time.

      Please use \`pnpm why @accelint-private/react-hotkey-manager\` to see where the duplicate is coming from.
    `,
  );
}
