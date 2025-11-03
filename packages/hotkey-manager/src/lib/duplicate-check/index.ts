/*
 * Copyright 2025 Hypergiant Galactic Systems Inc. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */

// TODO revisit this since it seems to be causing
// problems in its current form with SSR and/or
// HMR.

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
      @accelint/hotkey-manager is already initialized. Only one instance of the library can be used at a time.

      Please use \`pnpm why @accelint/hotkey-manager\` to see where the duplicate is coming from.
    `,
  );
}
